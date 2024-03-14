import moment from 'moment';

export enum DaysOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}
export enum DaysOfWeekNumber {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7,
}

export const DAYS_OF_WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
export const MONTHS = [
  { id: 0, name: 'Jan' },
  { id: 1, name: 'Feb' },
  { id: 2, name: 'Mar' },
  { id: 3, name: 'Apr' },
  { id: 4, name: 'May' },
  { id: 5, name: 'Jun' },
  { id: 6, name: 'Jul' },
  { id: 7, name: 'Aug' },
  { id: 8, name: 'Sep' },
  { id: 9, name: 'Oct' },
  { id: 10, name: 'Nov' },
  { id: 11, name: 'Dec' },
];

export const daysOfWeek = [
  DaysOfWeek.Monday,
  DaysOfWeek.Tuesday,
  DaysOfWeek.Wednesday,
  DaysOfWeek.Thursday,
  DaysOfWeek.Friday,
  DaysOfWeek.Saturday,
  DaysOfWeek.Sunday,
];

export const daysOfWeekFormat = {
  [DaysOfWeek.Monday]: DaysOfWeekNumber.Monday,
  [DaysOfWeek.Tuesday]: DaysOfWeekNumber.Tuesday,
  [DaysOfWeek.Wednesday]: DaysOfWeekNumber.Wednesday,
  [DaysOfWeek.Thursday]: DaysOfWeekNumber.Thursday,
  [DaysOfWeek.Friday]: DaysOfWeekNumber.Friday,
  [DaysOfWeek.Saturday]: DaysOfWeekNumber.Saturday,
  [DaysOfWeek.Sunday]: DaysOfWeekNumber.Sunday,
};

export const dateFormats = {
  sqlDateOnly: 'YYYY-MM-DD',
  sqlDateTime: 'YYYY-MM-DD HH:mm',
  sqlDateTimeFull: 'YYYY-MM-DD HH:mm:ss',
  abbreviatedPretty: 'DD MMM YYYY',
  sqlTimeOnly: 'HH:mm',
  prettyTime: 'HH:mm',
  dateOnlyPretty: 'DD MMMM YYYY',
  fullPretty: 'DD MMM YYYY HH:mm',
  weekDay: 'dd DD',
  monthFullYearFull: 'MMMM YYYY',
  monthNumber: 'M',
  monthDay: 'MMM DD',
  shortMonth: 'MMM',
  dayOnly: 'DD',
};

export const compareFormats = {
  month: 'month',
  day: 'day',
  year: 'year',
  time: 'time',
};

export const getFirstDayOfCalendar = (month: number, year: number) => {
  const currentDate = moment({ year, month });
  const firstDayOfCurrentMonth = currentDate.clone().startOf('month');
  const firstDayOfWeek = firstDayOfCurrentMonth.day();
  const daysFromPrevMonth = (firstDayOfWeek + 6) % 7;
  const firstDayOfCalendar = firstDayOfCurrentMonth.clone().subtract(daysFromPrevMonth, 'days');

  return firstDayOfCalendar.format('YYYY-MM-DD');
};

export const getLastDayOfCalendar = (month: number, year: number) => {
  const currentDate = moment({ year, month });
  const lastDayOfCurrentMonth = currentDate.clone().endOf('month');
  const lastDayOfWeek = lastDayOfCurrentMonth.day();
  const daysFromNextMonth = (6 - lastDayOfWeek + 1) % 7;
  const lastDayOfCalendar = lastDayOfCurrentMonth.clone().add(daysFromNextMonth, 'days');

  return lastDayOfCalendar.format('YYYY-MM-DD');
};

export const getFirstDayOfMonth = (month: number, year: number) => {
  return moment({ year, month }).startOf('month').format('YYYY-MM-DD');
};

export const getLastDayOfMonth = (month: number, year: number) => {
  return moment({ year, month }).endOf('month').format('YYYY-MM-DD');
};

export const generateYearsRange = (start: number, end: number) => {
  const years = [];
  let year = start;
  while (year <= end) {
    years.push(year);
    year++;
  }
  return years;
};

export const setMonth = (date: string, month: number) => {
  return moment(date).month(month).format(dateFormats.sqlDateOnly);
};

export const setYear = (date: string, year: number) => {
  return moment(date).year(year).format(dateFormats.sqlDateOnly);
};

export const addMonth = (date: string) => {
  return moment(date).add(1, 'month').format(dateFormats.sqlDateOnly);
};

export const subtractMonth = (date: string) => {
  return moment(date).subtract(1, 'month').format(dateFormats.sqlDateOnly);
};

export const addDay = (date: string) => {
  return moment(date).add(1, 'days').format(dateFormats.sqlDateOnly);
};

export const subtractDay = (date: string) => {
  return moment(date).subtract(1, 'days').format(dateFormats.sqlDateOnly);
};

export const addMinutes = (minutes: number, time?: string) => {
  if (!time) return;
  return moment(time, dateFormats.sqlTimeOnly).add(minutes, 'minutes').format(dateFormats.sqlTimeOnly);
};

export const subtractMinutes = (minutes: number, time?: string) => {
  return moment(time, dateFormats.sqlTimeOnly).subtract(minutes, 'minutes').format(dateFormats.sqlTimeOnly);
};

export const dateDiffDays = (startDate: string, endDate: string) => {
  return moment(endDate).diff(startDate, 'days');
};

export const sqlToday = () => {
  return moment().format(dateFormats.sqlDateOnly);
};

export const dateFromMonthYear = (month: number, year: number) => {
  return moment(`${year}-${month + 1}`, 'YYYY-MM').format(dateFormats.sqlDateOnly);
};

export const dateFromDayMonthYear = (day: number, month: number, year: number) => {
  return moment(`${year}-${month + 1}-${day}`, 'YYYY-MM-dd').format(dateFormats.sqlDateOnly);
};

export const currentYear = () => {
  return moment().year();
};

export const currentMonth = () => {
  return moment().month();
};

export const currentDay = () => {
  return moment().date();
};
export const isValidDate = (date?: string | null): boolean => {
  return moment(date).isValid();
};

export const sqlTime = () => {
  return moment().format(dateFormats.sqlTimeOnly);
};

export const sqlTodayWithTime = () => {
  return moment().format(dateFormats.sqlDateTime);
};

export const isSameDay = (date?: string) => {
  if (!date) return;
  return moment().isSame(date, 'day');
};

export const isSameOrBeforeDay = (date?: string) => {
  if (!date) return;
  return moment().isSameOrAfter(date, 'day');
};

export const isBefore = (earlierDate: string, olderDate: string) => {
  return moment(earlierDate).isBefore(olderDate, 'day');
};

export const isPast = (date: string) => {
  return moment(date).isBefore(sqlToday(), 'day');
};

export const momentToday = () => {
  return moment();
};

export const formatFromMonth = (month: number, year: number) => {
  return moment().month(month).year(year).format(dateFormats.sqlDateOnly);
};

export const currentMonthBase0 = (): number => {
  return moment().month();
};

export const getMonthBase0 = (date: string): number => {
  return moment(date).month();
};

export const getYear = (date: string): number => {
  return moment(date).year();
};

export const formatTime = (time: string | undefined, format: string) => {
  if (!time) return '';
  return moment(time, 'HH:mm').format(format);
};

export const formatDate = (date: string | undefined, format: string) => {
  if (!date) return '';
  return moment(date).format(format);
};

export const compareEqualDate = (date1: string, date2: string, compareFormat: string) => {
  if (compareFormat === compareFormats.month) {
    return moment(date1).isSame(date2, 'month');
  } else if (compareFormat === compareFormats.day) {
    return moment(date1).isSame(date2, 'day');
  }
};

export const compareEqualTime = (time1: string, time2: string) => {
  return moment(time1, dateFormats.sqlTimeOnly).isSame(moment(time2, dateFormats.sqlTimeOnly), 'minutes');
};

export const getDuration = (earlier: string, older: string) => {
  const duration = moment.duration(moment(older).diff(earlier));

  const hours = duration.asHours();
  const minutes = duration.asMinutes() % 60;
  return `${Math.floor(hours)}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

export const getFirstOfMonth = (date?: string) => {
  return moment(date).startOf('month').format(dateFormats.sqlDateOnly);
};

export const getHourFromTime = (time?: string) => {
  if (!time) return;
  const timeMoment = moment(time, dateFormats.sqlTimeOnly);
  return timeMoment.hour();
};

export const getMinuteFromTime = (time?: string) => {
  if (!time) return;
  const timeMoment = moment(time, dateFormats.sqlTimeOnly);
  return timeMoment.minute();
};

export const getPreviousFiveYears = () => {
  const currentYear = moment().year();
  const fiveYearsAgo = currentYear - 5;

  const yearsArray = [];
  for (let year = currentYear; year >= fiveYearsAgo; year--) {
    yearsArray.push(year);
  }

  return yearsArray;
};
