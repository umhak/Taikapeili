import { ajax } from 'jquery';

export const REQUEST_CALENDAR = 'REQUEST_CALENDAR';
export const RECEIVE_CALENDAR = 'RECEIVE_CALENDAR';

function requestCalendar() {
    return {
        type: REQUEST_CALENDAR
    };
}

function receiveCalendar(resp) {
    return {
        type: RECEIVE_CALENDAR,
        calendar: resp
    };
}

export function fetchCalendar() {
    return dispatch => {
        dispatch(requestCalendar());

        return ajax('http://localhost:3000/calendar')
        .done((resp) => {
            dispatch(receiveCalendar(resp));
        }).error(() => {
            console.log('error');
        });
    };
}
