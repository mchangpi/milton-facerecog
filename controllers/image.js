const handlePut = (db) => (req, resp) => {
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
};
module.exports = {
  handlePut,
};
