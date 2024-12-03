const Express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

var app = Express();
const connectionUrl = "mongodb://mongodb:27017/peliculas";
const port = process.env.PORT;

let db;

app.get("/movies/random/:column/:value", async (req, res) => {
  try {
    let column = req.params.column;
    let value = req.params.value;

    let obj = {};
    obj[column] = value;

    const cursor = await db.collection("movies").find(obj);
    const elements = await cursor.toArray();
    const randomElement = elements[Math.floor(Math.random() * elements.length)];

    res.json(randomElement);
  } catch (error) {
    res.status(500).end();
  }
});

app.get("/movies/random", async (req, res) => {
  try {
    const cursor = await db
      .collection("movies")
      .aggregate([
        { $sample: { size: 1 } },
        { $project: { _id: 1, title: 1, year: 1, poster: 1, plot: 1 } },
      ]);
    const result = await cursor.toArray();

    res.json(result[0]);
  } catch {
    res.status(500).end();
  }
});

app.get("/movies/:id", async (req, res) => {
  try {
    let movieId = req.params.id;
    const cursor = await db
      .collection("movies")
      .findOne({ _id: new ObjectId(movieId) });
    const result = await cursor;

    res.status(200).json(result);
  } catch (error) {
    res.status(500).end();
  }
});

app.get("/movies", async (req, res) => {
  try {
    const cursor = await db.collection("movies").find({});
    const result = await cursor.toArray();

    res.json(result);
  } catch {
    res.status(500).end();
  }
});

app.listen(port, () => {
  MongoClient.connect(connectionUrl)
    .then(async (client) => {
      db = client.db();
    })
    .catch((error) => {});
});
