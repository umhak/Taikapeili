const { each, filter, reduce, concat, isEmpty } = require('lodash');
const moment = require('moment');
const { fromURL } = require('ical');
const { url } = require('./config');
const birthdays = require('./birthdays');
const flagDays = require('./flagDays.json');
const nameDays = require('./nameDays.json');
moment.locale('fi');

const types = {
    event: 'event',
    birthday: 'birthday',
    flagDay: 'flagDay',
    nameDay: 'nameDay'
};

function getDayEvents(day, events) {
    const dayEvents = [];
    each(events, (event) => {
        const note = {};
        let addNote = false;

        if (day.isSame(event.start, 'day')) {
            addNote = true;
            const startTime = moment(event.start).format('HH:mm');

            if (startTime !== '00:00') {
                note.startTime = startTime;
            }
        }

        if (day.isSame(event.end, 'day')) {
            addNote = true;
            note.endTime = moment(event.start).format('HH:mm');
        }

        if (day.isBetween(event.start, event.end, 'day')) {
            addNote = true;
            note.fullDay = true;
        }

        if (addNote) {
            note.summary = event.summary;
            note.location = event.location;
            note.uid = event.uid;
            note.type = types.event;

            dayEvents.push(note);
        }
    });

    return dayEvents;
}

function isDay(day, birthday) {
    return birthday.get('month') === day.get('month') && birthday.get('date') === day.get('date');
}

function getBirthdays(dayToCheck) {
    return reduce(birthdays, (result, birthday) => {
        const { day: _day } = birthday;

        const day = moment(_day);

        if (isDay(dayToCheck, day)) {
            const { name } = birthday;
            const age = dayToCheck.diff(day, 'years');

            result.push({
                name,
                age,
                unit: 'v',
                type: types.birthday
            });
        }
        return result;
    }, []);
}

function getNameDays(dayToCheck) {
    return reduce(nameDays, (result, names, day) => {
        if (isEmpty(names)) return result;

        if (isDay(dayToCheck, moment(day))) {
            result.push({
                names,
                type: types.nameDay
            });
        }
        return result;
    }, []);
}

function getFlagDays(day) {
    return reduce(flagDays, (result, flagDay) => {
        const { date } = flagDay;

        if (day.isSame(date, 'day')) {
            const { name } = flagDay;

            result.push({
                name,
                type: types.flagDay
            });
        }
        return result;
    }, []);
}

function getDayNotes(day, events) {
    let dayNotes = [];

    // Add calendar notes
    dayNotes = concat(dayNotes, getDayEvents(day, events));

    // Add birthdays
    dayNotes = concat(dayNotes, getBirthdays(day));

    // Add flag days
    dayNotes = concat(dayNotes, getFlagDays(day));

    // Add name days
    dayNotes = concat(dayNotes, getNameDays(day));

    return dayNotes;
}

function getDays(today, events) {
    const days = [];
    for (let i = 0; i < 2; i++) {
        days.push({
            name: today.format('dd'),
            number: today.date(),
            month: today.format('MMM'),
            notes: getDayNotes(today, events)
        });

        today.add(1, 'days');
    }

    return days;
}

module.exports = (req, resp) => {
    fromURL(url, {}, (err, data) => {
        const events = filter(data, (calendarData) => {
            return calendarData.type === 'VEVENT';
        });

        const today = moment();
        const returnValue = {};
        returnValue.weekNumber = 'vko ' + today.week();
        returnValue.year = today.year();
        returnValue.month = today.format('MMMM');

        returnValue.days = getDays(today, events);
        resp.send(returnValue);
    });
};
