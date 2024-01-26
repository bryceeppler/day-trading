var express = require("express");
var app = express();

// mongo db uri for this microservice's database
// const mongoUri = process.env.MONGO_URI;

app.get("/", (req, res) => {
  res.send("This is the user microservice");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`User microservice on port ${port}...`);
});
