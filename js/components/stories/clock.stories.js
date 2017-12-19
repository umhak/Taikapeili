import React from 'react';
import { storiesOf } from '@storybook/react';
import Clock from '../clock.jsx';
import AnalogClock from '../analogClock.jsx';

storiesOf('Clock', module)
  .add('Digital clock', () => <Clock />)
  .add('Analog clock', () => <AnalogClock />);
