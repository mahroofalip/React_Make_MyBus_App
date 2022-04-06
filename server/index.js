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

// function veryfyToken(req,res,next){

//   const token = req.headers["x-access-token"];
//   console.log(token);

// }

// Admin signup
app.post("/admin/signup", async function (req, res) {
  console.log(req.body);
  let hashedPassword = await bcrypt.hash(req.body.Password, 10);

  let user = await db.get(
    `select * from owners where "owner_email" ='${req.body.Email}'`
  );
  console.log(user.rows[0]);
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
  console.log(req.body);

  let user = await db.get(
    `select * from owners where "owner_email" ='${req.body.Email}'`
  );

  if (user.rows[0]) {
    console.log("uer ok ");
    const validPassword = await bcrypt.compare(
      req.body.Password,
      user.rows[0].owner_password
    );
    console.log(validPassword);
    if (!validPassword) {
      console.log("but invalid password");
      return res.json({ user: 0 });
    } else {
      console.log("successfully login user ok");
      console.log(user.rows[0]);

      const { owner_name, owner_email } = user.rows[0];

      var token = jwt.sign(
        {
          email: owner_name,
          name: owner_email,
        },
        "secret123"
      );

      console.log(token);
      return res.json({ user: token });
    }
  } else {
    return res.json({ user: false });
  }
});

app.get("/", async (req, res) => {
  const results = await db.get("select * from students");
  res.json(results.rows);
  // console.log(results.rows);
});

app.listen(3001, () => {
  console.log("server running  port 3001");
});
