const request = require('request-promise-native');

const ICON_HOST = `http://openweathermap.org/img/wn/`;

/**
 * Gets the requested icon from OpenWeatherMap
 * and relays that icon to the front-end.
 * @param {String} icon - the icon name as used in OpenWeatherMap
 * @returns {Promise} - the promise is resolved with the icon buffer.
 */
exports.getIcon = async function getIcon(icon) {
    let iconRequest = await request({
        encoding: null,
        uri: ICON_HOST + icon + "@2x.png"
    });

    return iconRequest;
};