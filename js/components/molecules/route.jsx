import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map, isEmpty, merge, filter, take } from 'lodash';
import moment from 'moment';

import { fetchRoute } from '../../actions/route';
import styles from './styles/route.css';

class Route extends Component {
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

    getDepartures(departures) {
        if (isEmpty(departures)) {
            return <tr>Ei lähtöjä kuuteen tuntiin</tr>;
        }

        return map(departures, (dep, depIndex) => {
            const { datetime } = dep;
            const depTime = moment(datetime, 'YYYYMMDD HHmm');
            return (
                <tr key={depIndex} className={styles.dep}>
                    <td className={styles.eta}>{dep.eta}</td>
                    <td className={styles.lineCode}>{dep.codeShort}</td>
                    <td className={styles.depTime }>{depTime.format('HH:mm')}</td>
                </tr>);
        });
    }

    getStop(stop, stopIndex) {
        return (
            <div key={stopIndex} className={styles.stop}>
                <div className={styles.header}>{stop.name}</div>
                <table className={styles.departures}>
                    <tbody>
                        {this.getDepartures(stop.departures)}
                    </tbody>
                </table>
            </div>
        );
    }

    update() {
        const now = moment();

        const stops = map(this.props.stops, stop => {
            const { name, departures } = stop;

            const _departures = map(departures, departure => {
                const depTime = moment(departure.datetime, 'YYYYMMDD HHmm');

                let eta = depTime.diff(now, 'minutes');

                if (eta > 0) {
                    // add one minute because diff return a number rounded towards zero
                    eta += 1;
                }

                return merge(
                    {
                        eta
                    }, departure);
            });

            return {
                name,
                departures: take(filter(_departures, dep => dep.eta >= 0), 3)
            };
        });

        this.setState({
            stops
        });
    }

    interval() {
        this.update();

        const { updatedAt, isFetching } = this.props;

        if (updatedAt && !isFetching) {
            if (updatedAt.diff(moment(), 'minutes')) {
                this.props.fetchRoute();
            }
        }
    }

    get stops() {
        if (isEmpty(this.state.stops)) {
            return null;
        }

        return map(this.state.stops, (stop, stopIndex) => {
            return this.getStop(stop, stopIndex);
        });
    }

    render() {
        return (<div className = { styles.routesContainer }>
            {this.stops}
        </div>);
    }
}

Route.propTypes = {
    dispatch: PropTypes.func,
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
        fetchRoute: () => dispatch(fetchRoute())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Route);
