# MailerLite Webhook Splitter

This project solves the problem where MailerLite Classic batches webhook events into a single request if they occur for the same webhook within the same minute. This is problematic for receiving systems that cannot easily detect and handle those batches of events. In my case the Creatio low code platform would require complex C# coding in it's workflows script tasks to handle this (the low code dilemma..?). We decided to externalize solution of this problem, as the requirement for the feature will only last a few months.

MailerLite Classic documentation on the subject: https://developers-classic.mailerlite.com/docs/webhooks.

The working of this service is to:
- Receive the MailerLite webhook using an Express webserver
- Extract the MailerLite signature from the headers and the request body
- Validate the request body as JSON or return an error status
- Recalulate the signature using the raw request body and the MailerLite API key (from config/environment variables), observe that this is equal to the provided signature or return an error status
- Loop over de `events` object from the JSON request body and send a webhook to the configued endpoint (config/environment variables)

Two environment variables are expected:
- WEBHOOK_ENDPOINT => The endpoint to send the split webhook to
- MAILERLITE_SECRETKEY => MailerLite API key used as the HMAC signature secret key

Notes
- The MailerLite signature is not passed along with the split webhook.


