const functions = require("firebase-functions");
const fetch = require("node-fetch");

const ENDPOINT = "http://localhost:5001/time-entries-12b5d/us-central1/getWeather";

exports.updateWeatherTrigger = functions.firestore.document("/times/{id}").onCreate( async (snapshot) => {
    const { location } = snapshot.data();
    const body = JSON.stringify({ location });
    const response = await fetch(ENDPOINT, {method: "POST", body});
    const weather = await response.json();
    return snapshot.ref.update({ weather });
});

exports.getWeather = functions.https.onRequest((request, response) => {
    const { location } = JSON.parse(request.body);

    const WEATHER_MAP = {
        "Montevideo": Math.random() * 10 + 10,
        "London":  Math.random() * 10 + 15,
        "Miami":  Math.random() * 10 + 20,
    };
    const SKY_ARRAY = ["☀️", "⛅️", "🌧"];

    const temperature = WEATHER_MAP[location];
    const sky = SKY_ARRAY[Math.floor(Math.random() * SKY_ARRAY.length)];

    response.json({
        temperature,
        sky,
        metric: "celsius"
    });
})
