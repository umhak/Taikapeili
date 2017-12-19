import React from 'react';
import { storiesOf } from '@storybook/react';
import { Route } from '../route.jsx';

const stop1 = {
    name: 'Test stop',
    stoptimes: [{
        arrivalDelay: 0,
        realTime: '18:05',
        realtimeArrival: 64440,
        realtimeState: 'SCHEDULED',
        scheduledArrival: 64440,
        scheduledTime: '18:05',
        shortName: '553K',
        timeToArrival: 5
    }, {
        arrivalDelay: 300,
        realTime: '18:15',
        realtimeArrival: 64440,
        realtimeState: 'SCHEDULED',
        scheduledArrival: 64440,
        scheduledTime: '18:10',
        shortName: '553K',
        timeToArrival: 15
    }, {
        arrivalDelay: 300,
        realTime: '18:05',
        realtimeArrival: 64440,
        realtimeState: 'CANCELED',
        scheduledArrival: 64440,
        scheduledTime: '18:20',
        shortName: '553K',
        timeToArrival: 20
    }, {
        arrivalDelay: -60,
        realTime: '18:24',
        realtimeArrival: 64440,
        realtimeState: 'UPDATED',
        scheduledArrival: 64440,
        scheduledTime: '18:25',
        shortName: '553K',
        timeToArrival: 24
    }]
};

const stops = [stop1];
const fetchRoute = () => console.log('fetchRoute');

storiesOf('Route', module)
  .add('Routes all cases', () => <Route stops={stops} fetchRoute={fetchRoute} />);
