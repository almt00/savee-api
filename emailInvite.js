const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { to } = req.body;
  const inviteLink = "www.savee.pt/register?token=12345678";
  const config = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "savee.ua.pt@gmail.com",
      pass: "fhpztkibwaxtzzwm",
    },
  };

  const send = (data) => {
    const transporter = nodemailer.createTransport(config);
    transporter.sendMail(data, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        return info.response;
      }
    });
  };

  const data = {
    from: "savee.ua.pt@gmail.com",
    bcc: to,
    subject: "Convite para a SAVEE",
    text: `Olá,

    Foste convidado(a) a juntar-te ao Savee, a nova aplicação inovadora que te ajuda a poupar dinheiro de forma fácil. Clica no link abaixo para começar:
    
    ${inviteLink}
    
    Estamos ansiosos para te ter connosco!
    
    Cumprimentos,
    A Equipa Savee
    `,

    html: `<p>Olá,</p>
    <p>Foste convidado(a) a juntar-te ao Savee, a nova aplicação inovadora que te ajuda a poupar dinheiro de forma fácil. Clica no link abaixo para começar:</p>
    <p><a href="${inviteLink}">${inviteLink}</a></p>
    <p>Estamos ansiosos para te ter connosco!</p>
    <p>Com os melhores cumprimentos,<br>A Equipa Savee</p>
    `,
  };

  const r = await send(data);
  res.send(r);
});

module.exports = router;
