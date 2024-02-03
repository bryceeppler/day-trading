import moment from 'moment';
import { dateFormats } from './date';

const OPEN_HOUR = 7;
const CLOSE_HOUR = 22;

export const DEFAULT_START_TIME = '7:00';
export const DEFAULT_END_TIME = '21:00';

const MIN_JOB_TIME = 15;

export const dailyRowSettings = {
  interval: 15,
  height: 60,
};

export const getTimesArray = (startTime?: string, endTime?: string) => {
  const times = [];
  const openHour = startTime ? moment(startTime, dateFormats.sqlTimeOnly).hour() : OPEN_HOUR;
  let closeHour = endTime ? moment(endTime, dateFormats.sqlTimeOnly).hour() : CLOSE_HOUR;
  if (closeHour !== 0) closeHour += 1;
  for (let hour = openHour; hour < closeHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += MIN_JOB_TIME) {
      let time = '';
      if (hour < 10) time += '0';
      time += hour + ':';
      if (minutes < 10) time += '0';
      time += minutes;
      times.push(time);
    }
  }
  return times;
};
