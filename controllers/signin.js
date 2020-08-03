const handleSignin = (db, bcrypt) => (req, resp) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return resp.status(400).json("Error form submission");
  }
  db.select("email", "hash")
    .from("login")
    .where({ email: email })
    .then((list) => {
      const valid = bcrypt.compareSync(password, list[0].hash);
      if (valid) {
        return db
          .select("*")
          .from("users")
          .where({ email: email })
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
