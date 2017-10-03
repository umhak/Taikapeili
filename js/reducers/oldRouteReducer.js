import { merge } from 'lodash';
import { OLD_REQUEST_ROUTE, OLD_RECEIVE_ROUTE, } from '../actions/route';

export default function routes(state = {
    isFetching: false,
    stops: []
}, action) {
    switch (action.type) {
        case OLD_REQUEST_ROUTE:
            return merge({}, state, {
                isFetching: true
            });
        case OLD_RECEIVE_ROUTE: {
            const { stops, updatedAt } = action;
            return merge({}, state, {
                isFetching: false,
                stops,
                updatedAt
            });
        }
        default:
            return state;
    }
}
