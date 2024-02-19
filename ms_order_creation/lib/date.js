const moment = require('moment');

exports.dateFormat = {
  timeOnly24h: 'HH:mm',
  dateOnly: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DD HH:mm',
  prettyDateTime: 'DD MMM, YYYY HH:mm',
  prettyDate: 'DD MMM, YYYY',
};


exports.todayDate = moment().format(this.dateFormat.dateOnly);
exports.todayDateTime = moment().format(this.dateFormat.dateTime);