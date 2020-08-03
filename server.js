const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: 123,
      name: "john",
      email: "john@gmail",
      password: "john",
      entries: 0,
      joined: new Date(),
    },
    {
      id: 124,
      name: "sally",
      email: "sally@gmail",
      password: "sally",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, resp) => {
  resp.json(database.users);
});

app.listen(process.env["SERVER_PORT"], () => {
  console.log("node is listening on port " + process.env["SERVER_PORT"]);
});

//signin -> POST ok/fail
app.post("/signin", (req, resp) => {
  console.log(req.body.email, req.body.password);
  for (let i = 0; i < database.users.length; i++) {
    if (
      req.body.email === database.users[i].email &&
      req.body.password === database.users[i].password
    ) {
      return resp.json(database.users[i]);
    }
  }
  resp.json("login failed");
});

//register -> POST user
app.post("/register", (req, resp) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log("password as " + hash);
  });

  const lastId = database.users[database.users.length - 1].id;
  database.users.push({
    id: lastId + 1,
    name: name,
    email: email,
    //password: password,
    entries: 0,
    joined: new Date(),
  });
  resp.json(database.users[database.users.length - 1]);
});

//profile/:id -> GET user
app.get("/profile/:id", (req, resp) => {
  const { id } = req.params;
  database.users.forEach((user) => {
    if (user.id.toString() === id.toString()) {
      return resp.json(user);
    }
  });
  resp.status(404).json("Not found user with id " + id);
});

//image -> PUT user
app.put("/image", (req, resp) => {
  const { id } = req.body;
  console.log("user id: ", id);
  database.users.forEach((user) => {
    if (Number(user.id) === Number(id)) {
      user.entries++;
      return resp.json(user.entries);
    }
  });
  resp.status(404).json("Not found user with id " + id);
});

app.post("/profile", (req, resp) => {
  console.log(req.body);
  resp.json(req.body);
});
