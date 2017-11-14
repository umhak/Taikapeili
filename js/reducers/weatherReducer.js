import { REQUEST_WEATHER, RECEIVE_WEATHER, } from '../actions/weather';

export default function weather(state = {
    isFetching: false,
    values: {}
}, action) {
    switch (action.type) {
        case REQUEST_WEATHER:
            return Object.assign({}, state, {
                isFetching: true
            });
        case RECEIVE_WEATHER:
            return Object.assign({}, state, {
                isFetching: false,
                values: action.weather,
                daytime: action.daytime,
                times: action.times,
                moonPhase: action.moonPhase,
                lastUpdated: action.receicedAt
            });
        default:
            return state;
    }
}
