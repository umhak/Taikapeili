import { combineReducers } from 'redux';
import weather from './weatherReducer';
import calendar from './calendarReducer';
import routes from './routeReducer';

const rootReducer = combineReducers({
    weather,
    calendar,
    routes
});

export default rootReducer;
