import moment from 'moment';
import { ajax } from 'jquery';
import { each, map, filter, merge, concat, take, sortBy, includes } from 'lodash';

export const OLD_REQUEST_ROUTE = 'OLD_REQUEST_ROUTE';
export const OLD_RECEIVE_ROUTE = 'OLD_RECEIVE_ROUTE';

function oldRequestRoute() {
    return {
        type: OLD_REQUEST_ROUTE
    };
}

function oldReceiveRoute(resp) {
    return {
        type: OLD_RECEIVE_ROUTE,
        stops: resp,
        updatedAt: moment()
    };
}

// todo: use new api
export function fetchRoute() {
    return dispatch => {
        dispatch(oldRequestRoute());

        return ajax('http://localhost:3000/route')
        .done((resp) => {
            dispatch(oldReceiveRoute(resp));
        }).error(() => {
            console.log('error');
        });
    };
}

export const REQUEST_ROUTE = 'REQUEST_ROUTE';
export const RECEIVE_ROUTE = 'RECEIVE_ROUTE';

function requestRoute() {
    return {
        type: REQUEST_ROUTE
    };
}

function receiveRoute(resp) {
    return {
        type: RECEIVE_ROUTE,
        stops: resp,
        updatedAt: moment()
    };
}

function toHHMM(secs) {
    const secNum = parseInt(secs, 10); // don't forget the second param
    let hours = Math.floor(secNum / 3600);
    let minutes = Math.floor((secNum - (hours * 3600)) / 60);

    if (hours < 10) { hours = '0' + hours; }
    if (minutes < 10) { minutes = '0' + minutes; }
    return hours + ':' + minutes;
}

function parseStoptimes(stoptimesForServiceDate, stop, config) {
    let stoptimes = [];
    const seconds = moment().hours() * 3600 + moment().minute() * 60 + moment().seconds();

    each(stoptimesForServiceDate, patternStoptimeData => {
        const patternStopTimes = map(patternStoptimeData.stoptimes, stoptime => merge(
            {},
            stoptime,
            {
                shortName: patternStoptimeData.pattern.route.shortName,
                scheduledTime: toHHMM(stoptime.scheduledArrival),
                realTime: toHHMM(stoptime.realtimeArrival),
                timeToArrival: stoptime.realtimeState === 'CANCELED' ? Math.ceil((stoptime.scheduledArrival - seconds) / 60) : Math.ceil((stoptime.realtimeArrival - seconds) / 60),
                realtimeArrival: stoptime.realtimeState === 'CANCELED' ? stoptime.scheduledArrival : stoptime.realtimeArrival
            })
        );

        stoptimes = concat(stoptimes, patternStopTimes);
    });

    const includeLines = config.lines[stop.gtfsId];

    if (includeLines) {
        stoptimes = filter(stoptimes, stoptime => includes(includeLines, stoptime.shortName));
    }

    stoptimes = filter(stoptimes, stoptime => stoptime.scheduledArrival >= seconds);

    stoptimes = sortBy(stoptimes, ['realtimeArrival']);

    return take(stoptimes, 5);
}

function parseRoute(resp, config) {
    return map(resp.data.stops, (stop) => {
        return {
            name: stop.name,
            stoptimes: parseStoptimes(stop.stoptimesForPatterns, stop, config)
        };
    });
}

// wip:
export function fetchRouteNewApi() {
    return dispatch => {
        dispatch(requestRoute());

        const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
        const type = 'application/graphql';

        const config = {
            stops: '"HSL:1385163", "HSL:1392180", "HSL:1392551"',
            lines: {
                'HSL:1392180': ['73']
            }
        };

        let data = `{stops(ids: [${config.stops}])`;
        data +=	`{name, code, desc, gtfsId, vehicleType, stoptimesForPatterns {`;
        data += 'pattern { name, route { shortName } }, ';
        data += 'stoptimes{ realtimeArrival, scheduledArrival, arrivalDelay, realtimeState }';
        data += '}}}';

        return ajax({
            url,
            data,
            type: 'POST',
            contentType: type,
            dataType: 'json',
            success: (resp) => {
                dispatch(receiveRoute(parseRoute(resp, config)));
            }
        });
    };
}
