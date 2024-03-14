const axios = require('axios').default;

/**
 * @param {string} url
 * @param {object} params
 */
exports.GET = (url, params) => {
  const fetchAddr = `${url}${params ? `?${new URLSearchParams(params).toString()}` : ''}`;
  return axios.get(fetchAddr);
};


/**
 * @param {string} url
 * @param {object} data
 * @param {string} token - Used for authentication at the next end point
 */
exports.POST = (url, data, token) => {
  return axios.post(url, data, {
			headers: {
			'token': `${token}`,
			'Content-Type': 'application/json',
		}
	});
};
