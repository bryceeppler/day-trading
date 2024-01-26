var express = require("express");
var app = express();

app.get("/", (req, res) => {
  res.send("This is the matching engine microservice");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Matching engine microservice on port ${port}...`);
});
