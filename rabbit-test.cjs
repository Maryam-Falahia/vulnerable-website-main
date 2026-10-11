const amqp = require('amqplib');

async function main() {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  const queue = 'tasks';

  await channel.assertQueue(queue, { durable: true });

  // send
  channel.sendToQueue(queue, Buffer.from('hello'));

  // receive
  channel.consume(queue, (msg) => {
    console.log('Received:', msg.content.toString());
    channel.ack(msg);
  });
}

main().catch(console.error);
