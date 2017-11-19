import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { each, join } from 'lodash';
import moment from 'moment';

import { fetchCalendar } from '../actions/calendar';
import styles from './styles/calendar.css';

const propTypes = {
    fetchCalendar: PropTypes.func,
    calendar: PropTypes.object,
    isFetching: PropTypes.bool
};

class Calendar extends Component {
    componentDidMount() {
        this.props.fetchCalendar();
        setInterval(() => {
            this.updateData();
        }, 1000);
    }

    updateData() {
        const { isFetching } = this.props;

        const now = moment();

        if (now.second() === 0 && !isFetching) {
            this.props.fetchCalendar();
        }
    }

    get header() {
        const { weekNumber, year, month } = this.props.calendar;

        return (
            <div className = { styles.header }>
                <div className = { styles.weekNumber }>{ weekNumber }</div>
                <div className = { styles.month }>{ month }</div>
                <div className = { styles.year }>{ year }</div>
            </div>);
    }

    get days() {
        const { days } = this.props.calendar;
        const domDays = [];

        let notes;
        let notesContainer;
        each(days, (day) => {
            notes = [];
            notesContainer = undefined;

            each(day.notes, (note, index) => {
                let content;
                const { type } = note;
                switch (type) {
                    case 'birthday': {
                        content = (
                            <div className={styles.birthday}>
                                {note.name} {note.age}
                            </div>);
                        break;
                    }
                    case 'event': {
                        const location = note.location ? ' / ' + note.location : undefined;
                        const startTime = note.startTime ? note.startTime : undefined;
                        content = [];
                        content.push(<div className={styles.time} key={'startTime'}>{startTime}</div>);
                        content.push(<div className={styles.summary} key={'summary'}>{note.summary}{location}</div>);
                        break;
                    }
                    case 'flagDay': {
                        content = (
                            <div className={styles.flagDay}>
                                <div className={styles.flag} />
                                <span>{note.name}</span>
                            </div>);
                        break;
                    }
                    case 'nameDay': {
                        content = (
                            <div>
                                Nimipäivä: { join(note.names, ', ') }
                            </div>);
                        break;
                    }
                    default:
                        content = <div>{type}</div>;
                }

                notes.push(
                    <div key={index} className={ styles.note }>
                        {content}
                    </div>);
            });

            if (notes.length) {
                notesContainer = (
                    <div className={ styles.notes }>
                        {notes}
                    </div>);
            }
            domDays.push(
                <div className={ styles.row } key={ day.number }>
                    <div className={ styles.day }>
                        <div className={ styles.dayName }>{ day.name }</div>
                        <div className={ styles.dayNumber }>{ day.number }</div>
                    </div>
                    {notesContainer}
                </div>
            );
        });

        return <div className={ styles.container }>{ domDays }</div>;
    }

    render() {
        return (<div className={ styles.calendar }>
            { this.header }
            { this.days }
        </div>);
    }
}

function mapStateToProps({ calendar: calendarReducer }) {
    const { isFetching, calendar } = calendarReducer;

    return {
        isFetching,
        calendar
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCalendar: () => dispatch(fetchCalendar())
    };
}

Calendar.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
