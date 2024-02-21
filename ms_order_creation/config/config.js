'use strict';

const dotEnv = require('dotenv');
dotEnv.config();


const getEnvironment = (name) => {
  return process.env[name];
};
module.exports = {
  apiRootPath: getEnvironment('API_ROOT'),
	port: 3000,
	mongodb: getEnvironment('MONGO_URI'),
	mathingEngineUrl: getEnvironment('MATCHING_ENGINE_URL'),
  jwt: {
    accessTokenSecret: getEnvironment('JWT_SECRET'),
  },
};
