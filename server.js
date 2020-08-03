const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const app = express();
const cors = require("cors");
const knex = require("knex");

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
app.post("/signin", (req, resp) => {
  //console.log(req.body.email, req.body.password);
  db.select("email", "hash")
    .from("login")
    .where({ email: req.body.email })
    .then((list) => {
      const valid = bcrypt.compareSync(req.body.password, list[0].hash);
      if (valid) {
        return db
          .select("*")
          .from("users")
          .where({ email: list[0].email })
          .then((users) => resp.json(users[0]))
          .catch((err) => resp.status(400).json("Error when getting users"));
      } else {
        resp.status(400).json("Wrong credentials");
      }
    })
    .catch((err) => resp.status(400).json("Error when getting login"));
});

//register -> POST user
app.post("/register", (req, resp) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((logEmails) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: logEmails[0],
            joined: new Date(),
          })
          .then((users) => resp.json(users[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => resp.status(400).json("unable to register"));
});

//profile/:id -> GET user
app.get("/profile/:id", (req, resp) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((users) => {
      if (users.length > 0) resp.json(users[0]);
      else resp.status(400).json("Not found");
    })
    .catch((err) => resp.status(400).json("Errors when getting user"));
});

//image -> PUT user
app.put("/image", (req, resp) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      console.log("id ", id, " count ", entries[0]);
      resp.json(entries[0]);
    })
    .catch((err) => resp.status(400).json("Not increment entries"));
});
