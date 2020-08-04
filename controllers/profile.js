const handleGet = (db) => (req, resp) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((users) => {
      if (users.length > 0) resp.json(users[0]);
      else resp.status(400).json("Not found");
    })
    .catch((err) => resp.status(400).json("Errors when getting user"));
};
module.exports = {
  handleGet,
};
