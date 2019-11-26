const request = require('request-promise-native');
const db = require('../../../db');

const WEATHER_HOSTS = Object.freeze({
    "currentWeather": "https://api.openweathermap.org/data/2.5/weather",
    "hourlyWeather": "https://api.openweathermap.org/data/2.5/forecast"
});

/**
 * Gets the time of the last refresh of weather data.
 * @param {Object} location - Location data.
 * @param {String} location.city - City name.
 * @param {String} location.country - ISO 3166 country code.
 * @param {String} weatherType - The type of weather information to get,
 *   for example - "currentWeather" or "hourlyWeather".
 * @returns {Promise} - the promise is resolved with a number indicating 
 *   the time of the last refresh in milliseconds since the Unix Epoch.
 */
exports.getTimeOfLastRefresh = async function getTimeOfLastRefresh(location, weatherType) {
    let dbInstance = await db;

    let lastRefresh = await dbInstance.get("forecast")
        .get(location.city + ", " + location.country)
        .get(weatherType)
        .get("lastUpdated")
        .value();
    
    return lastRefresh;
};

/**
 * Fetches data from the remote server and stores it into the DB.
 * @param {Object} location - Location data.
 * @param {String} location.city - City name.
 * @param {String} location.country - ISO 3166 country code.
 * @param {String} weatherType - The type of weather information to get,
 *   for example - "currentWeather" or "hourlyWeather".
 * @returns {Promise} - the promise is resolved with the weather data object.
 */
exports.fetchData = function fetchData(location, weatherType) {
    return new Promise(async (resolve, reject) => {
        var weatherData;
        
        try {
            weatherData = await getWeatherData(location, weatherType);
            weatherData.lastUpdated = Date.now();
        } catch (err) {
            console.error(err);
            return reject(err);
        }

        resolve(weatherData);

        try {
            await writeData(location, weatherData, weatherType);
        } catch(err) {
            console.error(err);
        }
    });
};

/**
 * Gets the weather data stored in the DB.
 * @param {Object} location - Location data.
 * @param {String} location.city - City name.
 * @param {String} location.country - ISO 3166 country code.
 * @param {String} weatherType - The type of weather information to get,
 *   for example - "currentWeather" or "hourlyWeather".
 * @returns {Promise} - the promise is resolved with the weather data object.
 */
exports.getDataFromDB = async function getDataFromDB(location, weatherType) {
    let dbInstance = await db;

    let data = await dbInstance.get("forecast")
        .get(location.city + ", " + location.country)
        .get(weatherType)
        .value();
    
    return data;
};

async function getAPIKey() {
    let dbInstance = await db;

    let apiKey = await dbInstance.get("openWeather")
        .get("apiKey")
        .value();
    
    return apiKey;
}

async function getPlaceID(location) {
    let dbInstance = await db;

    let placeID = await dbInstance.get("forecast")
        .get(location.city + ", " + location.country)
        .get("id")
        .value();
    
    return placeID;
}

async function getWeatherData(location, weatherType) {
    let promises = [],
        data;
    
    promises.push(
        getAPIKey(),
        getPlaceID(location));
    
    data = await Promise.all(promises);

    let weatherResult = await request({
        uri: WEATHER_HOSTS[weatherType],
        qs: {
            appid: data[0],
            id: data[1]
        },
        json: true
    });

    return weatherResult;
}

async function writeData(location, data, weatherType) {
    let dbInstance = await db;

    await dbInstance.get("forecast")
        .get(location.city + ", " + location.country)
        .assign({[weatherType]: data})
        .write();
}