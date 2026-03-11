const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

/* GMAIL SMTP CONFIG */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lathasreediguvaputtur4006@gmail.com",
    pass: "itfj vqcj bret yidk"
  }
});

/* SEND EMAIL API */

app.post("/send-officer-email", async (req, res) => {

  const { name, email, password } = req.body;

  const mailOptions = {
    from: "yourgmail@gmail.com",
    to: email,
    subject: "Officer Account Created - Citizen Grievance Portal",
    html: `
      <h2>Hello ${name}</h2>

      <p>Your account has been created.Below are the credentials..</p>

      <b>Email:</b> ${email}<br/>
      <b>Password:</b> ${password}<br/><br/>
    <p>you can login to portal and then you can reset your password.The below is the link to login to the portal</p>
      <a href="http://localhost:3000/login">
        Login to Portal
      </a>
    `
  };

  try {

    await transporter.sendMail(mailOptions);

    res.json({ message: "Email sent successfully" });

  } catch (error) {

    console.log(error);

    res.status(500).json({ error: "Email failed" });

  }

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


