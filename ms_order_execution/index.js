var express = require("express");
var app = express();

const { MongoClient, ServerApiVersion } = require("mongodb");


// mongo db uri for this microservice's database
const mongoUri = process.env.MONGO_URI;

const client = new MongoClient(mongoUri,  {
  serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
  }
}
);

async function pingDb() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("successfully pinged mongo");
  } finally {
    await client.close();
  }
}

app.get("/healthcheck", async (req, res) => {
  try {
    await pingDb();
    res.send("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    res.status(500).send("MongoDB connection failed");
  }
});

app.get("/", (req, res) => {
  res.send("This is the order execution microservice");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Order execution microservice on port ${port}...`);
});
