const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');
const express = require('express');

const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

const PUBLIC_KEY = process.env.PUBLIC_KEY;

app.post('/api', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    if (interaction.data.name === 'ping') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Pong! 🏓',
        },
      });
    }
  }

  return res.status(400).send('Unknown interaction');
});

module.exports = app;