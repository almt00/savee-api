require("dotenv").config();
const express = require("express");
const router = express.Router();
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

router.post("/", (req, res) => {
  const { email } = req.body;

  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
  });

  const sentFrom = new Sender("savee.ua.pt@gmail.com", "SAVEE");

  const recipients = [new Recipient(email, "Ana")];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("This is a Subject")
    .setHtml("<strong>This is the HTML content</strong>")
    .setText("This is the text content");

  mailerSend.email
    .send(emailParams)
    .then((res) => res.json({ message: "Invite email sent successfully" }))
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
  // Send the email using MailerSend
});

module.exports = router;
