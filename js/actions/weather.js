import { each, get, last, assign } from 'lodash';
import fi from 'wfsrequestparser';
import weatherDescriptions from './weatherDescriptions';

export const REQUEST_WEATHER = 'REQUEST_WEATHER';
export const RECEIVE_WEATHER = 'RECEIVE_WEATHER';


function requestWeather(config) {
    return {
        type: REQUEST_WEATHER,
        config
    };
}

function receiveWeather(config, resp) {
    return {
        type: RECEIVE_WEATHER,
        weather: resp,
        config,
        receicedAt: Date.now()
    };
}

export function fetchWeather(config) {
    return dispatch => {
        dispatch(requestWeather(config));

        const STORED_QUERY_OBSERVATION = 'fmi::observations::weather::multipointcoverage';
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - 15 * 60000);

        const cb = (data, errors) => {
            const weather = {};

            if (errors.length) {
                weather.error = errors;
            } else {
                const locationData = get(data, 'locations[0].data');

                if (locationData) {
                    each(config.requestParameters, (param) => {
                        const paramData = locationData[param];
                        const property = paramData.property;
                        const lastValue = last(get(paramData, '.timeValuePairs'));

                        if (param === 'wawa') {
                            lastValue.value = weatherDescriptions[lastValue.value];
                        }
                        // Calculate "feels like" if both temperature and wind speed were found
                        // feels_like = 13.12 + 0.6215 * values['t2m'] - 13.956 * (values['ws_10min'] ** 0.16) + 0.4867 * values['t2m'] * (values['ws_10min'] ** 0.16)


                        weather[param] = assign({}, property, lastValue);
                    });
                }
            }

            dispatch(receiveWeather(config, weather));
        };

        const requestParameter = config.requestParameters.join(',');
        const url = 'http://data.fmi.fi/fmi-apikey/' + config.apikey + '/wfs';

        return fi.fmi.metoclient.metolib.WfsRequestParser.getData({
            url,
            storedQueryId: STORED_QUERY_OBSERVATION,
            requestParameter,
            begin: startTime,
            end: endTime,
            sites: config.place,
            callback: cb
        });
    };
}
