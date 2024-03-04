const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//const port = process.env.PORT || 3000;
const { MESSAGE_QUEUE } = require("./shared/lib/enums");
const { connectToRabbitMQ, consumeFromQueue } = require("./shared/config/rabbitmq");
const { executeOrder } = require("./service")

const app = express();
app.use((req, res, next) =>
{
  console.log(`${req.method} ${req.url}`);
  next();
});
app.us;
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { authSource: "admin" });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function ()
{
  console.log("Connected successfully");
});

app.get("/", (req, res) =>
{
  res.send("This is the order execution microservice.");
});


const rabbitmqUri = process.env.RABBITMQ_URI;

const RabbitSetup = async () => {
  try {
      const { connection, channel } = await connectToRabbitMQ(rabbitmqUri);
      await channel.assertQueue(MESSAGE_QUEUE.EXECUTE_ORDER, { durable: true });
      await channel.consume(
          MESSAGE_QUEUE.EXECUTE_ORDER,
          async (data) => {
              if (data) {
                  const message = JSON.parse(data.content.toString());
                  console.log("Recieved Execute Order Message: ", message);
                  executeOrder(message);
              }
          },
          { noAck: true }
      );
  } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
  }
};


RabbitSetup();

// Start the server
// app.listen(port, () =>
// {
//   console.log();
//   console.log(`Order Execution Service running on port ${port}`);
// });
