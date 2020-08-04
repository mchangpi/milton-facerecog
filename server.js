const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const app = express();
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

//require("dotenv").config();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

let db = knex({
  client: "pg",
  connection: {
    host: "satao.db.elephantsql.com",
    port: 5432,
    user: "tpqomhwb",
    password: "Hude8-38yP7xVycOipEyXMO7isUJ67Aw",
    database: "tpqomhwb",
  },
});

app.listen(PORT, () => {
  console.log("node is listening on port " + PORT);
});

if (true) {
  app.use(express.static("client/build"));
}

app.get("/", (req, resp) =>
  resp.send("<h2>Node is listening on port: " + PORT + "</h2>")
);

app.post("/signin", signin.handleSignin(db, bcrypt));

app.post("/register", register.handleRegister(db, bcrypt));

app.get("/profile/:id", profile.handleGet(db));

//image -> POST clarifai api
app.post("/imageurl", image.handleApi);

//image -> PUT user entries
app.put("/image", image.handlePut(db));
