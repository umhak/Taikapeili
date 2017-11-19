import React from 'react';
import moment from 'moment';
import styles from './styles/clock.css';

export default class Clock extends React.Component {
    componentDidMount() {
        setInterval(() => {
            this.forceUpdate();
        }, 1000);
    }

    render() {
        const now = moment();

        return (<div className={styles.normal}>
            <div>{now.format('HH:mm')}</div>
        </div>);
    }
}
