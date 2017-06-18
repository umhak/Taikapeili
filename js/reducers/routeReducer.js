import { merge } from 'lodash';
import { REQUEST_ROUTE, RECEIVE_ROUTE, } from '../actions/route';

export default function routes(state = {
    isFetching: false,
    stops: []
}, action) {
    switch (action.type) {
        case REQUEST_ROUTE:
            return merge({}, state, {
                isFetching: true
            });
        case RECEIVE_ROUTE: {
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
