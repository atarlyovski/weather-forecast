const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileAsync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const API_KEY = "{YOUR_OPENWEATHERMAP_API_KEY}";

db.then(db => {
    db.defaults({
        users: [
            {
                id: 1,
                username: "admin",
                password: "$2a$12$TbEVhB7w7cnujvA7PcwYl.zeEW5RPGqBLW4b820Nb4ddIMlSRub0.",
                privileges: {canSeeLongTermForecast: true}
            }, {
                id: 2,
                username: "user",
                password: "$2a$12$D2mWIRLsY93P.7UR9Iqkq.G/engpbjV/mdicjOupFwB/f2VXMTg5a",
                privileges: {}
            }
        ],
        sessions: [],
        forecast: {
            "Sofia, BG": {
                id: 727011,
                currentWeather: null,
                hourlyWeather: null
            }
        },
        openWeather: {
            apiKey: API_KEY
        }
    }).write();
});

module.exports = db;