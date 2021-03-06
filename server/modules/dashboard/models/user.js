"use strict";
const bcrypt = require('bcrypt');
const db = require('../../../db');

/**
 * Authenticates a user by checking if the username and password match.
 * The password is compared against the bcrypt hash stored in the DB.
 * @param {String} username
 * @param {String} password - The plain text password provided by the user.
 * @returns {Promise} - The promise is resolved with the user object if
 *   the password matches or with the value of false which indicates
 *   to the passport middleware that the authentication was unsuccessful.
 */
exports.authenticateUser = function authenticateUser(username, password) {
    return new Promise(async (resolve, reject) => {
        let isOK = false,
            user;

        if (typeof username !== "string" || !username) {
            return reject(new Error("The username must be a non-empty string!"));
        }

        if (typeof password !== "string" || !password) {
            return reject(new Error("The passwrod must be a non-empty string!"));
        }

        try {
            let userData = await getHashedPasswordForUser(username);
            
            if (userData.found) {
                isOK = await bcrypt.compare(password, userData.password);
            }

            if (isOK) {
                user = await fetchUserByUsername(username);
            }
        } catch (err) {
            return reject(err);
        }

        resolve(isOK ? user : false);
    });
};

exports.fetchUserByID = fetchUserByID;

function fetchUserByID(userID) {
    return new Promise(async (resolve, reject) => {
        var user;

        try {
            user = fetchUser({id: userID});
        } catch (error) {
            return reject(err);
        }

        resolve(user);
    });
}

function fetchUserByUsername(username) {
    return new Promise(async (resolve, reject) => {
        var user;

        try {
            user = fetchUser({username: username});
        } catch (error) {
            return reject(err);
        }

        resolve(user);
    });
}

async function fetchUser(filter) {
    var user,
        dbInstance;

    dbInstance = await db;

    user = await dbInstance.get("users")
        .filter(filter)
        .value();

    if (!user || !user[0]) {
        resolve(false);
    }

    return user[0];
}

async function getHashedPasswordForUser(username) {
    var user,
        dbInstance;

        dbInstance = await db;

        user = await dbInstance.get("users")
            .filter({username: username})
            .value();

    if (!user || !user[0]) {
        return {found: false};
    }

    return {found: true, password: user[0].password};
}