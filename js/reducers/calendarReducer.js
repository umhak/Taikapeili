import { REQUEST_CALENDAR, RECEIVE_CALENDAR } from '../actions/calendar';

export default function calendarReducer(state = {
    isFetching: false,
    calendar: {}
}, action) {
    switch (action.type) {
        case REQUEST_CALENDAR:
            return Object.assign({}, state, {
                isFetching: true
            });
        case RECEIVE_CALENDAR:
            return Object.assign({}, state, {
                isFetching: false,
                calendar: action.calendar
            });
        default:
            return state;
    }
}
