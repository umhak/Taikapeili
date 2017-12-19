import React from 'react';
import { storiesOf } from '@storybook/react';
import { Calendar } from '../calendar.js';

const fetchCalendar = () => console.log('fetchCalendar');

const nameday = {
    name: 'su',
    number: 19,
    notes: [{
        names: ['petri', 'johannes'],
        type: 'nameDay'
    }]
};

const flagDay = {
    name: 'ma',
    number: 20,
    notes: [{ type: 'flagDay', name: 'test flag day' }]
};

const birthday = {
    name: 'ti',
    number: 21,
    notes: [{ type: 'birthday', name: 'Petri', age: '30' }]
};

const event = {
    name: 'ke',
    number: 22,
    notes: [{ type: 'event', startTime: '18:00', summary: 'Party', location: 'home' }]
};

const calendar = {
    month: 'marraskuu',
    weekNumber: 'vko 46',
    year: 2017,
    days: [nameday, flagDay, birthday, event]
};

storiesOf('Calendar', module)
  .add('All cases', () => <Calendar fetchCalendar={fetchCalendar} calendar={calendar} />);
