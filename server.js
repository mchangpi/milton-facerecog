const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const app = express();
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

let db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "milton",
    password: "milton",
    database: "smart-brain",
  },
});

app.listen(process.env["SERVER_PORT"], () => {
  console.log("node is listening on port " + process.env["SERVER_PORT"]);
});

//signin -> POST ok/fail
app.post("/signin", signin.handleSignin(db, bcrypt));

//register -> POST user
app.post("/register", register.handleRegister(db, bcrypt));

//profile/:id -> GET user
app.get("/profile/:id", profile.handleGet(db));

//image -> POST clarifai api
app.post("/imageurl", image.handleApi);
//image -> PUT user
app.put("/image", image.handlePut(db));
