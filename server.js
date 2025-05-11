import crypto from 'crypto'
import express from 'express'
import axios from 'axios';
import { DateTime } from 'luxon'
import config from './config.js';

const app = express();
app.use(express.raw({ type: 'application/json' }));

app.listen(config.serverPort, () => log(`Service started and listening on port ${config.serverPort}`));

app.post("/", async (req, res) => {

    const signature = req.headers["x-mailerlite-signature"]
    const rawBody = req.body
    const querystrng = req.query
    
    let parsedBody
    try {
        parsedBody = JSON.parse(rawBody.toString('utf8'));
    } catch(error) {
        log("Request ignored due to invalid request body")
        return res.status(400).send()
    }

    if (signatureMatches(signature, rawBody)) {
        const events = parsedBody.events;

        log(`Splitting webhook into ${events.length} separate requests to ${config.webhookEndpoint}`)
    
        for (const event of events) {
            try {
                const response = await axios.post(config.webhookEndpoint, {events: [event]}, {params: querystrng})
            } catch(error) {
                log("Error sending split event: (nextline)")
                log(error.message)
            }
            
        }
        return res.status(204).send()
    } else {
        log("Request ignored due to invalid signature.")
        return res.status(403).send()
    }
})

const signatureMatches = (signature, requestBody) => {
    const hmac = crypto.createHmac('sha256', config.mailerLiteSecretKey);
    hmac.update(requestBody);

    const calculatedSignature = hmac.digest().toString("base64")

    /*
        We would return true if the signature is equal to the calculated signature, but we will
        use 'timingSafeEqual' to prevent timing based attacks. The following lines are to 
        prepare this.
    */
    const sigBuffer = Buffer.from(signature || '', 'utf8');
    const calcBuffer = Buffer.from(calculatedSignature, 'utf8');

    if (sigBuffer.length !== calcBuffer.length) return false;

    return crypto.timingSafeEqual(sigBuffer, calcBuffer);
}


const log = (msg) => {
    console.log(`${DateTime.now().setZone("Europe/Amsterdam").toISO()} - ${msg}`)
}