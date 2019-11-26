"use strict";
const Router = require('@koa/router');

const weatherController = require('../modules/dashboard/controllers/weather');
const iconController = require('../modules/dashboard/controllers/icon');

const router = new Router();
const ROUTE_PREFIX = '/api/dashboard';
const LOCATION = Object.freeze({city: "Sofia", country: "BG"});

router.get(ROUTE_PREFIX + '/currentWeather', async (ctx, next) => {
    var currentWeather;

    try {
        currentWeather = await weatherController.getWeather(LOCATION, "currentWeather");
    } catch (err) {
        console.error(err);
        return ctx.throw(500);
    }

    ctx.response.set({"Cache-Control": "max-age=" + 10 * 60});
    ctx.body = currentWeather;
});

router.get(ROUTE_PREFIX + '/hourlyWeather', async (ctx, next) => {
    let privileges = ctx.state.user.privileges || {};

    if (!privileges.canSeeLongTermForecast) {
        return ctx.throw(403);
    }

    await next();
}, async (ctx, next) => {
    var hourlyWeather;

    try {
        hourlyWeather = await weatherController.getWeather(LOCATION, "hourlyWeather");
    } catch (err) {
        console.error(err);
        return ctx.throw(500);
    }

    // Prevent the browser from showing cached
    // information after the user has changed:
    ctx.response.set({
        "Cache-Control": "must-revalidate",
        "Expires": -1
    });

    ctx.body = hourlyWeather;
});

router.get(ROUTE_PREFIX + '/icon', async ctx => {
    var icon;

    if (!ctx.request.query.icon) {
        ctx.throw(400);
        return;
    }

    try {
        icon = await iconController.getIcon(ctx.request.query.icon);
    } catch (err) {
        console.error(err);
        return ctx.throw(500);
    }

    ctx.type = 'image/png';
    ctx.set({"Cache-Control": "max-age=172000"});
    ctx.body = icon;
});

module.exports = router;