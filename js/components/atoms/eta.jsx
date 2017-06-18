import React, { Component, PropTypes } from 'react';
import moment from 'moment';

class Eta extends Component {
    constructor() {
        super();

        this.state = {};

        setInterval(() => {
            this.update();
        }, 1000);
    }

    componentWillMount() {
        this.update();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.eta !== this.state.eta) {
            return true;
        }

        return false;
    }

    update() {
        const depTime = moment(this.props.datetime, 'YYYYMMDD HHmm');

        // add one minute becouse diff return a number rounded towards zero
        depTime.add(1, 'minutes');

        const eta = depTime.diff(moment(), 'minutes');

        this.setState({
            eta
        });
    }

    render() {
        return <div>{this.state.eta}</div>;
    }
}

Eta.propTypes = {
    datetime: PropTypes.string.isRequired
};

export default Eta;
