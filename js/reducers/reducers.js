import { combineReducers } from 'redux';
import weather from './weatherReducer';
import routes from './routeReducer';
import calendar from './calendarReducer';

const rootReducer = combineReducers({
    weather,
    routes,
    calendar
});

export default rootReducer;
