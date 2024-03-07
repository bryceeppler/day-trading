const cleanString = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value.trim();
};

const cleanData = (data) => {
  Object.keys(data).forEach((key) => {
    if (typeof data[key] == 'string') {
      data[key] = cleanString(data[key]);
    } else if (typeof data[key] == 'object') {
      if (Array.isArray(data[key])) {
        data[key].forEach((item) => {
          if (typeof item == 'object') {
            cleanData(item);
          } else if (typeof data[key] == 'string') {
            item = cleanString(data[key]);
          }
        });
      } else if (data[key] !== null) {
        cleanData(data[key]);
      }
    }
  });
};

exports.cleanReq = (req, res, next) => {
  cleanData(req.body);
  cleanData(req.params);
  cleanData(req.query);
  next();
};