const express = require("express");
const app = express();
const connectDB = require("./config/database");
const matchingRoutes = require('./routes/matchingRoutes');

connectDB();


app.use(express.json());
app.use('/', matchingRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Matching engine microservice on port ${port}...`);
});
