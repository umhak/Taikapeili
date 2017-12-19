import React from 'react';
import { configure, addDecorator } from '@storybook/react';

addDecorator(story => {
  const style = {
    color: 'white',
    background: 'black',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
  return (
    <div style={style}>
      {story()}
    </div>
  );
});
const req = require.context('../js/components', true, /\.stories\.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
