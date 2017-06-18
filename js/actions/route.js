import moment from 'moment';
import { ajax } from 'jquery';

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

// todo: use new api
export function fetchRoute() {
    return dispatch => {
        dispatch(requestRoute());

        return ajax('http://localhost:3000/route')
        .done((resp) => {
            dispatch(receiveRoute(resp));
        }).error(() => {
            console.log('error');
        });
    };
}

// wip:
export function fetchRouteNewApi() {
    return dispatch => {
        dispatch(requestRoute());

        const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
        const data = '{stop(id: "HSL:1173210") {name, lat, lon, wheelchairBoarding}}';

        const type = 'application/graphql';

        return ajax({
            url,
            data,
            type: 'POST',
            contentType: type,
            dataType: 'json',
            success: (resp) => {
                console.log(resp);
            }
        });
    };
}
