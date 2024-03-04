const amqp = require('amqplib/callback_api');

let rabbitConnection;
let rabbitChannel;

exports.connectToRabbitMQ = (rabbitMqUrl) =>
{
    amqp.connect(rabbitMqUrl, function (err, connection)
    {
        if (err)
        {
            console.error('Error connecting to RabbitMQ:', err);
            return;
        }

        console.log('Connected to RabbitMQ successfully.');

        connection.createChannel(function (err, channel)
        {
            if (err)
            {
                console.error('Error creating channel:', err);
                return;
            }

            console.log('Channel created successfully.');
            rabbitConnection = connection;
            rabbitChannel = channel;
            return channel;
        });
    })
};

// Function to publish message to RabbitMQ queue
exports.publishToQueue = async (queueName, message) =>
{
    try
    {
        if (!rabbitChannel) {
            throw new Error('RabbitMQ channel is null');
        }
        await rabbitChannel.assertQueue(queueName, { durable: true });
        rabbitChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log('Message published to queue:', message);
    } catch (error)
    {
        throw new Error('Error publishing message to queue: ' + error.message);
    }
}
// Function to publish message to RabbitMQ queue
exports.consumeFromQueue = async (queueName, handleMessage) =>
{
    try
    {
        if (!rabbitChannel) {
            throw new Error('RabbitMQ channel is null');
        }
        await rabbitChannel.assertQueue(queueName, { durable: true });
        rabbitChannel.consume(
            queueName,
            async (data) =>
            {
              if (data)
              {
                const message = JSON.parse(data.content.toString());
                console.log("Recieved Execute Order Message: ", messeage);
                handleMessage(message);
              }
            },
            { noAck: true }
          );
        console.log('Message published to queue:', message);
    } catch (error)
    {
        throw new Error('Error subscribing to queue: ' + error.message);
    }
}

// Export rabbitChannel
exports.rabbitChannel = rabbitChannel;