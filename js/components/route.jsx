import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { map, isEmpty } from 'lodash';
import moment from 'moment';

import { fetchRouteNewApi } from '../actions/route';
import styles from './styles/route.css';

export class Route extends Component {
    constructor(props) {
        super();

        this.state = {
            stops: props.stops
        };

        setInterval(() => {
            this.interval();
        }, 1000);
    }

    componentDidMount() {
        this.props.fetchRoute();
    }

    getDeparture(stoptime, depIndex) {
        const { realtimeState, arrivalDelay } = stoptime;
        const cells = [];
        let classes = styles.dep;
        cells.push(<td key="shortname">{stoptime.shortName}</td>);
        cells.push(<td key="timeToArrival">{stoptime.timeToArrival}</td>);

        let timeCell = stoptime.scheduledTime;

        if ((realtimeState !== 'CANCELED') && (arrivalDelay >= 60 || arrivalDelay <= -60)) {
            timeCell += ` -> ${stoptime.realTime}`;
        }

        cells.push(<td key="timeCell">{timeCell}</td>);

        if (realtimeState === 'CANCELED') {
            // cells.push(<td>Peruttu</td>);
            classes += ` ${styles.canceled}`;
        }

        return (
          <tr key={depIndex} className={classes}>
            {cells}
          </tr>
        );
    }

    getDepartures(stoptimes) {
        if (isEmpty(stoptimes)) {
            return <tr>Ei lähtöjä kuuteen tuntiin</tr>;
        }

        return map(stoptimes, (stoptime, depIndex) => (
            this.getDeparture(stoptime, depIndex)
        ));
    }

    getStop(stop, stopIndex) {
        return (
            <div key={stopIndex} className={styles.stop}>
                <div className={styles.header}>{stop.name}</div>
                <table className={styles.departures}>
                    <tbody>
                        {this.header}
                        {this.getDepartures(stop.stoptimes)}
                    </tbody>
                </table>
            </div>
        );
    }

    get header() {
        return (
            <tr className={styles.rowHeader}>
                <td className={styles.line}>linja</td>
                <td className={styles.eta}>min</td>
                <td className={styles.time}>aika</td>
            </tr>
        );
    }

    interval() {
        const { updatedAt, isFetching } = this.props;

        if (updatedAt && !isFetching) {
            if (updatedAt.format('mm') !== moment().format('mm')) {
                this.props.fetchRoute();
            }
        }
    }

    get stops() {
        if (isEmpty(this.props.stops)) {
            return null;
        }

        return map(this.props.stops, (stop, stopIndex) => {
            return this.getStop(stop, stopIndex);
        });
    }

    render() {
        return (
          <div className = { styles.routesContainer }>
            {this.stops}
          </div>
        );
    }
}

Route.propTypes = {
    stops: PropTypes.array,
    updatedAt: PropTypes.object,
    isFetching: PropTypes.bool,
    fetchRoute: PropTypes.func
};

function mapStateToProps({ routes }) {
    const { stops, updatedAt, isFetching } = routes;

    return {
        updatedAt,
        stops,
        isFetching
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchRoute: () => dispatch(fetchRouteNewApi())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Route);
