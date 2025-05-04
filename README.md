# MailerLite Webhook Splitter

This project solves the problem where MailerLite Classic batches webhook events into a single request if they occur for the same webhook within the same minute. This is problematic for receiving systems can cannot easily detect and handle those batches of events. In my case the Creatio low code platform would require complex C# coding in it's workflows script tasks to handle this (the low code contradiction..?). We decided to externalize solution of this problem, as the requirement for the feature will only last a few months.

MailerLite Classic documenbtation on the subject: https://developers-classic.mailerlite.com/docs/webhooks