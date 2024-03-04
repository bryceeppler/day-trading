
import * as amqp from "amqplib/callback_api";
import { Order } from "../types";

let rabbitChannel: amqp.Channel | null = null;

const connectToRabbitMQ = async (rabbitmqURI?: string): Promise<{ connection: amqp.Connection, channel: amqp.Channel }> => {
    return new Promise<{ connection: amqp.Connection, channel: amqp.Channel }>((resolve, reject) => {
        const rabbitUri = rabbitmqURI ?? process.env.RABBITMQ_URI ?? 'amqp://guest:guest@localhost:5672';
        amqp.connect(rabbitUri, (err: any, conn: amqp.Connection) => {
            if (err) {
                console.error('Error connecting to RabbitMQ:', err);
                reject(err);
                return;
            }

            conn.createChannel((err: any, channel: amqp.Channel) => {
                if (err) {
                    console.error('Error creating channel:', err);
                    conn.close();
                    reject(err);
                    return;
                }
                console.log("consumer rabbitMQ : connected");
                rabbitChannel = channel;
                resolve({ connection: conn, channel: channel });
            });
        });
    });
};

// Function to publish message to RabbitMQ queue
const publishToQueue = async (queueName: string, orderMessage: any): Promise<void> => {
    try {
        if (!rabbitChannel) {
            throw new Error('RabbitMQ channel is null');
        }
        await rabbitChannel.assertQueue(queueName, { durable: true });
        rabbitChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(orderMessage)), { persistent: true });
    } catch (error) {
        console.error('Error publishing message to queue: ', error);
    }
};

export { connectToRabbitMQ, publishToQueue };