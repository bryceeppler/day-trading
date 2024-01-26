var express = require("express");
var app = express();

app.get("/", (req, res) => {
  res.send("This is the market data microservice");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Market data microservice on port ${port}...`);
});
