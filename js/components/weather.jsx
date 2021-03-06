import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchWeather } from '../actions/weather';
import styles from './styles/weather.css';
require('../../css/weather-icons.min.css');
import weatherIconMappings from './weatherIconMappings';
import moonPhaseIconMapping from './moonPhaseIconMapping';
import moment from 'moment';
import { get } from 'lodash';

class Weather extends Component {
    componentDidMount() {
        const { dispatch, config } = this.props;
        dispatch(fetchWeather(config));

        setInterval(() => {
            dispatch(fetchWeather(config));
        }, 120000);
    }

    render() {
        const temperature = this.props.values.t2m || {};
        const wawa = this.props.values.wawa || {};
        const clouds = get(this.props, 'values.n_man') || 0;
        const daytime = this.props.daytime;
        const moonPhase = this.props.moonPhase;
        const times = this.props.times || {};
        let wawaClass;

        if (wawa.value !== 0) {
            wawaClass = 'wi-' + (daytime ? 'day' : 'night') + '-' + weatherIconMappings[wawa.value];
        } else {
            wawaClass = (daytime ? 'wi-day-' : 'wi-night-');

            if (clouds > 1) {
                wawaClass += (daytime ? 'sunny' : 'clear');
            } else {
                wawaClass += 'cloudy';
            }
        }

        return (
            <div className={styles.weather}>
                <div className={styles.wawa}><i className={'wi ' + wawaClass} /></div>
                <div className={styles.weatherInfo}>
                    <div className={styles.degree}>{Math.round(temperature.value)}<i className="wi wi-degrees" /></div>
                    <div><i className="wi wi-sunrise" />{moment(times.sunrise).format('HH:mm')}</div>
                    <div><i className="wi wi-sunset" />{moment(times.sunset).format('HH:mm')}</div>
                    <div><i className={'wi ' + moonPhaseIconMapping[moonPhase]} /></div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { weather } = state;
    const { isFetching, values, daytime, times, moonPhase } = weather;

    return {
        isFetching,
        values,
        daytime,
        times,
        moonPhase
    };
}

Weather.propTypes = {
    config: PropTypes.object,
    dispatch: PropTypes.func,
    values: PropTypes.object,
    times: PropTypes.object,
    daytime: PropTypes.bool,
    moonPhase: PropTypes.number
};

export default connect(mapStateToProps)(Weather);
