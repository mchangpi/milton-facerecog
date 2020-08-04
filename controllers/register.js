const handleRegister = (db, bcrypt) => (req, resp) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return resp.status(400).json("Error form submission");
  }
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
};
module.exports = {
  handleRegister,
};
