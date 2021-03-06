import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './styles/widget.css';

// components
import Clock from './clock.jsx';
import AnalogClock from './analogClock.jsx';
import Weather from './weather.jsx';
import Calendar from './calendar';
import Route from './route.jsx';

export default class Widget extends Component {
    getComponent() {
        const name = this.props.data.name;

        switch (name) {
            case 'clock': {
                const { type } = this.props.data;
                switch (type) {
                    case 1:
                    default:
                        return <Clock data={this.props.data} />;
                    case 2:
                        return <AnalogClock data={this.props.data} />;
                }
            }
            case 'weather':
                return <Weather config={this.props.data} />;
            case 'calendar':
                return <Calendar config={this.props.data} />;
            case 'route':
                return <Route />;
            default:
                return <div> invalid component: {name} </div>;
        }
    }

    render() {
        const component = this.getComponent();

        return <div className={styles.normal}>{component}</div>;
    }
}

Widget.propTypes = {
    data: PropTypes.object.isRequired
};
