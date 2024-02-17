const { GOOGLE_API } = require('../lib/googleMaps');
const axios = require('./base');
const apiKey = require('../config/config').googleMaps;
const accountServices = require('../services/accounts.service');

/**
 * @param {string} url
 * @param {object} params
 */
function googleGet(url, params) {
  return axios.GET(url, { key: apiKey, ...params });
}

exports.getPossibleAddresses = async (address, accountId) => {
  const url = `${GOOGLE_API}/place/textsearch/json`;
  const accountDetails = await accountServices.fetchAccount({ accountId });

  const location = `${accountDetails.address.latitude},${accountDetails.address.longitude}`;
  const response = await googleGet(url, { query: address, location, radius: 50000 });
  if (response.data.status === 'ZERO_RESULTS') {
    return [];
  }
  return response.data.results.map((data) => {
    return { name: data.formatted_address };
  });
};

/**
 * @param {string} address
 * @returns {{ lat: number, lng: number }}
 *
 * docs from [google](https://developers.google.com/maps/documentation/geocoding/requests-geocoding)
 * docs for [ascii encodings]https://www.asciitable.com/)
 */
exports.getAddressDetails = async (address) => {
  const url = `${GOOGLE_API}/geocode/json`;
  const response = await googleGet(url, { address: address });

  if (response.data.status === 'ZERO_RESULTS') {
    return;
  }
  const data = response.data.results[0];
  let streetNumber, streetName, postalCode, city, country, region, regionCode, unit;
  for (const detail of data.address_components) {
    const type = detail.types[0];
    switch (type) {
      case 'subpremise':
        unit = detail.short_name.replace(/unit\s+/i, '');
        break;
      case 'street_number':
        streetNumber = detail.long_name;
        break;
      case 'route':
        streetName = detail.short_name;
        break;
      case 'locality':
        city = detail.short_name;
        break;
      case 'postal_code':
        postalCode = detail.short_name;
        break;
      case 'administrative_area_level_1':
        region = detail.long_name;
        regionCode = detail.short_name;
        break;
      case 'country':
        country = detail.long_name;
        break;
    }
  }

  return {
    latitude: data.geometry.location.lat,
    longitude: data.geometry.location.lng,
    streetName,
    streetNumber,
    postalCode,
    unit,
    city,
    country,
    region,
    regionCode,
    formatted: data.formatted_address,
  };
};

/**
 * @param {{ lat: number, lng: number }} origin
 * @param {Array<{ lat: number, lng: number }>} destinations
 *
 * docs from [google](https://developers.google.com/maps/documentation/distance-matrix/distance-matrix)
 * docs for [ascii encodings](https://www.asciitable.com/)
 *
 * example return
 * [
 *   {
 *     destination: { lat: 123, lng: 321 },
 *     value: {
 *       distance: { text: "123 km", value: 33253 },
 *       duration: { text: "10 mins", value: 1620 },
 *       duration_in_traffic: { text: "34 mins", value: 999 },
 *       status: "OK",
 *     }
 *   },
 *   {
 *     destination: { lat: 123, lng: 321 }, // for each destinations
 *     value: {
 *       distance: { text: "123 km", value: 33253 },
 *       duration: { text: "10 mins", value: 1620 },
 *       duration_in_traffic: { text: "34 mins", value: 999 },
 *       status: "OK",
 *     }
 *   },
 * ]
 */
exports.getDistance = async (origin, destinations) => {
  const uri = `${GOOGLE_API}/distancematrix/json`;

  const originParam = `${origin.lat},${origin.lng}`;
  const destinationParams = destinations.map(({ lat, lng }) => `${lat},${lng}`).join('|');

  const params = {
    origins: originParam,
    destinations: destinationParams,
  };

  const response = await googleGet(uri, params);
  const data = response.data.rows[0].elements;

  return destinations.map((destination, i) => ({
    destination,
    value: data[i],
  }));
};

/**
 * @param {{lat: number, lng: number}} origin
 * @param {{lat: number, lng: number}} dest
 * @returns {number} distance
 *
 * - get the straight line distance from origin to destination, ignore street paths, etc etc..
 * - calculated using the [haversine formula](https://en.wikipedia.org/wiki/Haversine_formula)
 * - JS Algo from [Stackoverflow](https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
 */
exports.getArialDistance = (origin, dest) => {
  const EARTH_RADIUS = 6371e3; // in meters
  const { sin, cos, sqrt, atan2, PI } = Math;

  const rad = (deg) => (deg * PI) / 180; // converts degree to radian
  const square = (a) => a * a;

  const deltaLat = rad(dest.latitude - origin.latitude);
  const deltaLng = rad(dest.longitude - origin.longitude);

  const s = square(sin(deltaLat / 2)) + square(sin(deltaLng / 2)) * cos(rad(origin.latitude)) * cos(rad(dest.latitude));

  return Math.floor(EARTH_RADIUS * 2 * atan2(sqrt(s), sqrt(1 - s)));
};
