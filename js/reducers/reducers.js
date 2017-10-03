import { combineReducers } from 'redux';
import weather from './weatherReducer';
import oldRoutes from './oldRouteReducer';
import calendar from './calendarReducer';
import routes from './routeReducer';

const rootReducer = combineReducers({
    weather,
    oldRoutes,
    calendar,
    routes
});

export default rootReducer;
