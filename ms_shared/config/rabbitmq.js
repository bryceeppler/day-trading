const amqp = require('amqplib/callback_api');

let rabbitConnection;
let rabbitChannel;

exports.connectToRabbitMQ = async (rabbitMqUrl) =>
{
    return new Promise((resolve, reject) => {
        amqp.connect(rabbitMqUrl, function (err, connection)
        {
            if (err)
            {
                console.error('Error connecting to RabbitMQ:', err);
                reject(err);
                return;
            }

            console.log('Connected to RabbitMQ successfully.');

            connection.createChannel(function (err, channel)
            {
                if (err)
                {
                    console.error('Error creating channel:', err);
                    reject(err);
                    return;
                }

                console.log('Channel created successfully.');
                rabbitConnection = connection;
                rabbitChannel = channel;
                resolve({ connection, channel });
            });
        })
    });
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
