const amqp = require('amqplib');

(async () => {
  const conn = await amqp.connect('amqp://localhost');
  const channel = await conn.createChannel();
  await channel.assertQueue('tasks', { durable: true });

  channel.consume('tasks', (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log('Processing:', data);
    channel.ack(msg);
  });
})();
