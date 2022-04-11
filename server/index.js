const express = require("express");
const app = express();
var morgan = require("morgan");
app.use(morgan("combined"));
const cors = require("cors");
const db = require("./db/connection");
require("dotenv").config();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");
const { response } = require("express");
const cloudinary = require("cloudinary").v2;

const ACCOUNT_SID = process.env.ACCOUNT_SID;
const SERVICE_ID = process.env.SERVICE_ID;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

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

//admin add bus
app.post("/admin/addbus", async (req, res) => {
  const permit = {
    image: req.body.permit,
  };
  const image1 = {
    image: req.body.image1,
  };
  const image2 = {
    image: req.body.image2,
  };
  const image3 = {
    image: req.body.image3,
  };
  const image4 = {
    image: req.body.image4,
  };

  let permit_link = await cloudinary.uploader.upload(permit.image, {
    folder: "mybus",
  });
  let image1_link =await cloudinary.uploader.upload(image1.image, {
    folder: "mybus",
  });
  let image2_link =await cloudinary.uploader.upload(image2.image, {
    folder: "mybus",
  });
  let image3_link =await cloudinary.uploader.upload(image3.image, {
    folder: "mybus",
  });

  let image4_link =await cloudinary.uploader.upload(image4.image, {
    folder: "mybus",
  });
  console.log(image1_link,'imaaaaaaaaaaaaaaaage ');
  const newbus = await db.get(
    "INSERT INTO busdetails(busname,registernumber,bustype,seats,fromstart,toend,duration,departuredate,departuretime,arraivaldate,arraivaltime,permit,image1,image2,image3,image4) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *",
    [
      req.body.busname,
      req.body.registerNUmber,
      req.body.busType,
      req.body.seats,
      req.body.from,
      req.body.to,
      req.body.duration,
      req.body.depDate,
      req.body.depTime,
      req.body.arrivDate,
      req.body.arrivTime,
      permit_link.secure_url,
      image1_link.secure_url,
      image2_link.secure_url,
      image3_link.secure_url,
      image4_link.secure_url,
    ]
  );
  console.log(newbus.rows[0], "this is the new bus");
});

app.listen(3001, () => {
  console.log("server running  port 3001");
});

app.post("/user/otp/request", (req, res) => {
  // console.log(
  //   ACCOUNT_SID,
  //   "   Acc ",
  //   SERVICE_ID,
  //   "    serviceid   ",
  //   AUTH_TOKEN,
  //   "   Auth"
  // );

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
