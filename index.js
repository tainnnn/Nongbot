require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(token);

// Global command: ใช้งานได้ทุกเซิร์ฟเวอร์
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Registering global slash command...');
    await rest.put(
      Routes.applicationCommands(clientId), // << Global command
      { body: commands },
    );
    console.log('Global command registered.');
  } catch (error) {
    console.error(error);
  }
})();
