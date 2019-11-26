"use strict";
const Router = require('@koa/router')
const passport = require('koa-passport')

const router = new Router();
const ROUTE_PREFIX = '/api/login';

router.post(ROUTE_PREFIX + '/login',
    ctx => passport.authenticate('local', (err, user) => {
        if (err) {
            throw err;
        }

        if (user === false) {
            ctx.body = { success: false };
            ctx.throw(401);
        } else {
            ctx.body = {
                success: true,
                user: {
                    username: user.username,
                    privileges: user.privileges
                }
            };

            return ctx.login(user)
        }
    })(ctx)
);

router.post(ROUTE_PREFIX + '/logout', ctx => {
    ctx.logout();
    ctx.body = ({ success: true });
});

module.exports = router;