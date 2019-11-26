# Weather App

## What it is
This is a demonstration Weather App which gets the current weather and hourly forecast for Sofia, Bulgaria.  
It features:

* A Node.js server using Koa.js.
* A lowdb JSON database for storing user information and for caching weather data from [OpenWeatherMap](https://openweathermap.org/).
* Two user accounts which have different privileges: `admin:admin` and `user:user`.
* React-based front-end which handles all the views.

## How to run it
After cloning the repo, you have to set your OpenWeatherMap API key. Before running the app for the first time, this can be done in the `/server/db.js` file by assigning the key to the API_KEY constant. In case the server has been run before, a `db.json` file will be created with the default values from `db.js` and you will need to enter the key in `db.json` (just look for the `{YOUR_OPENWEATHERMAP_API_KEY}` string and replace it with your key).

You then need to install all dependencies in both the `client` and the `server` folders:

    cd client
    npm i
    cd ../server
    npm i

After that, you can start the two processes by using `npm start` in their folders:

    cd client
    npm start
and

    cd server
    npm start
After that you can use any of the two accounts to log into the app:

    // This user can view both the current weather and the hourly forecast
    username: admin
    password: admin

    // This user can only view the current weather
    username: user
    password: user