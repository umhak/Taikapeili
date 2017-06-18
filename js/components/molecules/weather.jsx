import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { each } from 'lodash';
import { fetchWeather } from '../../actions/weather';
import styles from './styles/weather.css';

const propTypes = {
    config: PropTypes.object,
    dispatch: PropTypes.func,
    values: PropTypes.object
};

class Weather extends Component {
    componentDidMount() {
        const { dispatch, config } = this.props;
        dispatch(fetchWeather(config));
    }

    get weatherInfo() {
        const weathers = [];


        const temperature = this.props.values.t2m || {};

        return <div>{temperature.value} C</div>;

        // todo: display more weather data:
        // each(this.props.values, (weather, key) => {
        //     weathers.push(
        //         <div key={key}>
        //             <span>{weather.label}:</span>
        //             <span> {weather.value}</span>
        //             <span> {weather.unit}</span>
        //         </div>
        //     );
        // });

        // return weathers;
    }

    // function to generate a random number range.
    randRange(minNum, maxNum) {
        return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
    }

    get drops() {
        const dropsCount = 150;
        const drops = [];
        for (let i = 0; i < dropsCount; i++) {
            const style = {
                top: this.randRange(-200, 300),
                left: this.randRange(1, 300)
            };

            drops.push(<div className={styles.drop} style={style} key={i} />);
        }

        return drops;
    }

    get animation() {
        return null;
        return (
            <div className={styles.rain}>
                {this.drops}
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.weatherInfo}
                {this.animation}
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { weather } = state;
    const { isFetching, values } = weather;

    return {
        isFetching,
        values
    };
}

Weather.propTypes = propTypes;

export default connect(mapStateToProps)(Weather);
