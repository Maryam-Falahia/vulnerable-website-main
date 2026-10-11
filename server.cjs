const express = require('express');
const cors = require('cors');
const amqp = require('amqplib');

const app = express();
app.use(cors());
app.use(express.json());

let channel;

async function connectRabbit() {
  const conn = await amqp.connect('amqp://localhost');
  channel = await conn.createChannel();
  await channel.assertQueue('tasks', { durable: true });
}

app.post('/api/tasks', (req, res) => {
  channel.sendToQueue('tasks', Buffer.from(JSON.stringify(req.body)), { persistent: true });
  res.json({ status: 'queued' });
});

connectRabbit().then(() => {
  app.listen(3001, () => console.log('API on http://localhost:3001'));
});
