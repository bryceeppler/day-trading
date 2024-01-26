var express = require("express");
var app = express();

app.get("/", (req, res) => {
  res.send("This is the order execution microservice");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Order execution microservice on port ${port}...`);
});
