const handleSignin = (db, bcrypt) => (req, resp) => {
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
};

module.exports = {
  handleSignin,
};
