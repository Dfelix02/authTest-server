const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");

//routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

//connect db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to db");
  }
);

//middlewares
app.use(cors());
app.use(express.json());

//Route middlewares
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

//mail
app.post("/send_mail", async (req, res) => {
  let { email } = req.body;

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Minor Test",
    html: `<div className="email" style="border: 1px solid black; padding: 20px; font-family: sans-serif; line-height: 2; font-size: 20px;">
    <h2>Here is your email!</h2>
    </div>`,
  });
});

app.listen(3000, () => console.log("server up!"));
