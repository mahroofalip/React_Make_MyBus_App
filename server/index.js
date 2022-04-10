const express = require("express");
const app = express();
var morgan = require("morgan");
app.use(morgan("combined"));
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db/connection");
require("dotenv").config();
const bcrypt = require("bcrypt");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");
const { response } = require("express");

const ACCOUNT_SID = process.env.ACCOUNT_SID;
const SERVICE_ID = process.env.SERVICE_ID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

// Admin signup
app.post("/admin/signup", async function (req, res) {
  let hashedPassword = await bcrypt.hash(req.body.Password, 10);

  let user = await db.get(
    `select * from owners where "owner_email" ='${req.body.Email}'`
  );

  if (user.rows[0]) {
    return res.json({ user: false });
  } else {
    const newUser = await db.get(
      "INSERT INTO owners(owner_name, owner_email,owner_password) values($1,$2,$3) RETURNING *",
      [req.body.Name, req.body.Email, hashedPassword]
    );

    const userName = newUser.rows[0].owner_name;
    const userEmail = newUser.rows[0].owner_email;

    var token = jwt.sign(
      {
        name: userName,
        email: userEmail,
      },
      "secret123"
    );

    return res.json({ user: token });
  }
});

// admin Login
app.post("/admin/Login", async (req, res) => {
  let user = await db.get(
    `select * from owners where "owner_email" ='${req.body.Email}'`
  );

  if (user.rows[0]) {
    const validPassword = await bcrypt.compare(
      req.body.Password,
      user.rows[0].owner_password
    );

    if (!validPassword) {
      return res.json({ user: 0 });
    } else {
      const { owner_name, owner_email } = user.rows[0];

      var token = jwt.sign(
        {
          email: owner_name,
          name: owner_email,
        },
        "secret123"
      );

      return res.json({ user: token });
    }
  } else {
    return res.json({ user: false });
  }
});

app.listen(3001, () => {
  console.log("server running  port 3001");
});

app.post("/user/otp/request", (req, res) => {
  console.log(
    ACCOUNT_SID,
    "   Acc ",
    SERVICE_ID,
    "    serviceid   ",
    AUTH_TOKEN,
    "   Auth"
  );

  client.verify
    .services(SERVICE_ID)
    .verifications.create({
      to: `+91${req.body.mobileNumber}`,
      channel: "sms",
    })
    .then((response) => {
      res.status(200).json({ status: response.status, user: req.body });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/user/otp/verify", (req, res) => {
  console.log("i am called verify");

  USERDATA = JSON.parse(req.body.USER);

  client.verify
    .services(SERVICE_ID)
    .verificationChecks.create({
      to: `+91${USERDATA.mobileNumber}`,
      code: req.body.OTP,
    })
    .then(async (verification) => {
      console.log(verification);
      if (verification.valid) {
        let hashedUserPassword = await bcrypt.hash(USERDATA.Password, 10);
        const newUser = await db.get(
          "INSERT INTO users(name,email,password,mobile) values($1,$2,$3,$4) RETURNING *",
          [
            USERDATA.Name,
            USERDATA.Email,
            hashedUserPassword,
            USERDATA.mobileNumber,
          ]
        );
        console.log("FORM SUCCESSFULLY SUBMITTED");
        const userName = newUser.rows[0].name;
        const userEmail = newUser.rows[0].email;

        var token = jwt.sign(
          {
            name: userName,
            email: userEmail,
          },
          "secret123"
        );
        return res.json({ status: true, userToken: token });
      } else {
        console.log("FORM NOT SUBMITED");
        return res.json({ status: false, Error: "Invalid otp" });
      }
    });
});
