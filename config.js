const config = {
    serverPort: 8080,
    webhookEndpoint: process.env["WEBHOOK_ENDPOINT"], 
    mailerLiteSecretKey: process.env["MAILERLITE_SECRETKEY"]
}

export default config