import React from 'react';
import { render } from 'react-dom';
import Layout from './components/templates/layout.jsx';
import { Provider } from 'react-redux';
import createStore from './store';
import { weatherApiKey } from '../config';

const containers = {
    right: [
        {
            name: 'clock',
            type: 2 // 1 = digital, 2 = analog
        }
    ],
    left: [
        {
            name: 'weather',
            apikey: weatherApiKey,
            requestParameters: ['wawa', 't2m', 'ws_10min', 'n_man'],
            place: 'Helsinki'
        },
        {
            name: 'calendar'
        },
        {
            name: 'route'
        }
    ],
    bottom: []
};


const store = createStore();

render(
    <Provider store={store}>
        <Layout containers={containers} />
    </Provider>,
    document.getElementById('app')
);
