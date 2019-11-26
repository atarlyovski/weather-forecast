var moment = require('moment');

var weatherModel = require('../models/weather');

const UPDATE_INTERVALS_MINUTES = Object.freeze({
    currentWeather: 10,
    hourlyWeather: 60
});

/**
 * Gets the weather either from OpenWeatherMap or
 * from the DB if the data there is considered fresh
 * (determined by UPDATE_INTERVALS_MINUTES).
 * @param {Object} location - Location data.
 * @param {String} location.city - City name.
 * @param {String} location.country - ISO 3166 country code.
 * @param {String} weatherType - The type of weather information to get,
 *   for example - "currentWeather" or "hourlyWeather".
 * @returns {Promise} - The promise is resolved with the weather data object.
 */
exports.getWeather = async function getWeather(location, weatherType) {
    var weatherData;

    let shouldFetchNewData = await shouldNewDataBeFetched(
        location,
        weatherType,
        UPDATE_INTERVALS_MINUTES[weatherType]
    );

    if (shouldFetchNewData) {
        console.log("remote " + weatherType);
        weatherData = await weatherModel.fetchData(location, weatherType);
    } else { // Get the last data from the DB
        console.log("local " + weatherType);
        weatherData = await weatherModel.getDataFromDB(location, weatherType);
    }

    return weatherData;
};

/**
 * Checks if the weather information in the DB should be refreshed.
 * Determined by the time of the last update and the specified update interval.
 * If no data exists in the DB for the specified weather type, returns true.
 * @param {Object} location - Location data.
 * @param {String} location.city - City name.
 * @param {String} location.country - ISO 3166 country code.
 * @param {String} weatherType - The type of weather information to get,
 *   for example - "currentWeather" or "hourlyWeather".
 * @param {Number} [updateIntervalMinutes=10] - Time interval after which data is considered stale.
 * @returns {Promise} - The promise is resolved with true if data should be fetched from the
 *   remote server or false if we can use the data from our database.
 */
async function shouldNewDataBeFetched(location, weatherType, updateIntervalMinutes = 10) {
    let timeOfLastRefresh =
        await weatherModel.getTimeOfLastRefresh(location, weatherType);

    let timeWhenToAllowUpdates = moment(timeOfLastRefresh)
        .add(updateIntervalMinutes, "minutes");
    
    if (!timeOfLastRefresh || moment().isAfter(timeWhenToAllowUpdates)) {
        return true;
    }

    return false
}