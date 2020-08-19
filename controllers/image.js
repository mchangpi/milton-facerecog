const clarifai = require("clarifai");
require("dotenv").config();

const app = new clarifai.App({
    apiKey: process.env.CLARIFAI_API,
});
const handleApi = (req, resp) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then((data) => resp.json(data))
        .catch((err) => resp.status(400).json("Error calling Clarifai api"));
};
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
    handleApi,
    handlePut,
};