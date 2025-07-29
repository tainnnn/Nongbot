require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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

  if (interaction.commandName === 'an') {
    const title = interaction.options.getString('title');
    const image = interaction.options.getString('image');
    const description = interaction.options.getString('description');

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor(0x00AE86)
      .setTimestamp();

    if (description) embed.setDescription(description);
    if (image) embed.setImage(image);

    await interaction.reply({ embeds: [embed] });
  }
});

client.login(token);

//Register Global Slash Commands
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  new SlashCommandBuilder()
    .setName('an')
    .setDescription('สร้าง embed พร้อม title รูปภาพ และคำอธิบาย')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('ใส่ชื่อหัวข้อ')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('ใส่คำอธิบายหรือแท็กผู้คน (optional)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('image')
        .setDescription('URL ของรูปภาพ (optional)')
        .setRequired(false))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Registering global slash commands...');
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );
    console.log('Global slash commands registered.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
})();
