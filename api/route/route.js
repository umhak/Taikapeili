// todo: use new reittiopas api:
// https://digitransit.fi/en/developers/services-and-apis/1-routing-api/1-getting-started/
// http://dev.hsl.fi/graphql/console/?query=%23%20Welcome%20to%20GraphiQL%0A%23%0A%23%20GraphiQL%20is%20an%20in-browser%20IDE%20for%20writing%2C%20validating%2C%20and%0A%23%20testing%20GraphQL%20queries.%0A%23%0A%23%20Type%20queries%20into%20this%20side%20of%20the%20screen%2C%20and%20you%20will%0A%23%20see%20intelligent%20typeaheads%20aware%20of%20the%20current%20GraphQL%20type%20schema%20and%0A%23%20live%20syntax%20and%20validation%20errors%20highlighted%20within%20the%20text.%0A%23%0A%23%20To%20bring%20up%20the%20auto-complete%20at%20any%20point%2C%20just%20press%20Ctrl-Space.%0A%23%0A%23%20Press%20the%20run%20button%20above%2C%20or%20Cmd-Enter%20to%20execute%20the%20query%2C%20and%20the%20result%0A%23%20will%20appear%20in%20the%20pane%20to%20the%20right.%0A%0A%7B%0A%20%20alerts%20%7B%0A%20%20%20%20alertDescriptionText%0A%20%20%7D%0A%7D
// http://graphql.org/code/

const _ = require('lodash');
const http = require('http');
const config = require('./config');
const moment = require('moment');

const urlRoot = 'http://api.reittiopas.fi/hsl/prod/?';

const { each, flatten, map, padStart, isEmpty, filter, includes } = require('lodash');

function getUserUrl() {
    const user = config.user || {};

    return `user=${user.name}&pass=${user.pass}`;
}

function getUrl() {
    return `${urlRoot}${getUserUrl()}`;
}

function convertDateTime(pDate, pTime) {
    let addDay = false;
    let time = pTime;

    // time format
    // 20161004 0105 can be 20160904 2505
    if (time >= 2400) {
        time -= 2400;
        addDay = true;
    }

    time = time.toString();

    // add leading zeros eg 530 => 0530
    time = padStart(time, 4, '0');

    const dateString = `${pDate} ${time}`;
    const datetimeFormat = 'YYYYMMDD HHmm';
    const datetime = moment(dateString, datetimeFormat);

    if (addDay) {
        datetime.add(1, 'days');
    }

    return datetime.format(datetimeFormat);
}

function getStopData({ code: stopCode, lines }) {
    const promise = new Promise((resolve, reject) => {
        http.get(`${getUrl()}&request=stop&code=${stopCode}&dep_limit=20&time_limit=360`, (res) => {
            let body = '';

            res.on('data', (d) => {
                body += d;
            });

            res.on('end', () => {
                const respJSON = JSON.parse(body);
                const stops = [];
                let linesQuery;
                each(respJSON, (_stop) => {
                    const stop = {};
                    const { departures } = _stop;
                    const lineCodes = map(departures, dep => dep.code);

                    stop.name = _stop.name_fi;

                    stop.departures = map(departures, departure => {
                        const { code, time, date } = departure;

                        const datetime = convertDateTime(date, time);

                        return {
                            code,
                            datetime,
                            date,
                            time
                        };
                    });

                    stops.push(stop);

                    linesQuery = lineCodes.join('|');
                });

                if (!linesQuery) {
                    resolve(stops);
                    return;
                }

                http.get(`${getUrl()}&request=lines&query=${linesQuery}`, (linesResp) => {
                    let linesBody = '';
                    linesResp.on('data', (d) => {
                        linesBody += d;
                    });

                    linesResp.on('end', () => {
                        const linesJSON = JSON.parse(linesBody);

                        each(stops, (stop) => {
                            // add codeShort to every departures
                            each(stop.departures, (dep) => {
                                const line = _.find(linesJSON, (_line) => {
                                    return _line.code === dep.code;
                                }) || {};

                                dep.codeShort = line.code_short;
                            });

                            // filter by lines from config
                            if (!isEmpty(lines)) {
                                stop.departures = filter(stop.departures, dep => includes(lines, dep.codeShort));
                            }
                        });

                        resolve(stops);
                    });
                });
            });
        }).on('error', (e) => {
            console.log('Got error: ' + e.message);
            reject(e.message);
        });
    });
    return promise;
}

module.exports = (req, resp) => {
    const stops = config.stops || [];

    const promises = [];

    each(stops, stop => {
        promises.push(getStopData(stop));
    });

    Promise.all(promises).then(result => {
        resp.send(flatten(result));
    });
};
