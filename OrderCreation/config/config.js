'use strict';

const dotEnv = require('dotenv');
dotEnv.config();


const getEnvironment = (name) => {
  return process.env[name];
};
module.exports = {
  apiRootPath: getEnvironment('API_ROOT'),
	port: getEnvironment('PORT'),
  jwt: {
    accessTokenSecret: getEnvironment('ACCESS_TOKEN_SECRET'),
    accessTokenRefresh: getEnvironment('ACCESS_TOKEN_REFRESH'),
  },
};
