const express = require("express")
const axios = require("axios")
const cron = require('node-cron')
const { config } = require("dotenv")

config()
const app = express()
const port = process.env.PORT || 3000


const urls = process.env.URLS;
const formattedUrls = urls.split(" ")
console.log(formattedUrls, "FORMATED")

async function runStartMqttServer(url) {
    try {
        const response = await axios.post(`https://${url}/mqtt/connect`)
        console.info(response.data, "RESPONSE FROM API")
    } catch (error) {
        console.error(error, "AN ERROR OCCURRED")
    }
}
// Cron Job
function cronJob() {
    // RUN EVERY 1 HOUR
    cron.schedule("0 * * * *", async () => {
        console.log("Restarting MQTT servers...");
        const results = await Promise.all(
            formattedUrls.map((url) => runStartMqttServer(url))
        );
        console.log("MQTT servers restarted...", results);
    });
}

// Call the cron job function
cronJob();


app.get('*', (_, res) => {
    res.json({ message: "We good bro..." })
})

app.listen(port, () => {
    console.info(`App listening on http://127.0.0.1:${port}`)
})