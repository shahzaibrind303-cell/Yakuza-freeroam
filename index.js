// ===== LOAD ENV SAFELY =====
try {
    require('dotenv').config();
} catch (e) {
    console.log("dotenv not found, using Railway ENV");
}

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    REST,
    Routes,
    SlashCommandBuilder
} = require('discord.js');

// ===== ENV VARIABLES =====
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const SERVER_IP = process.env.SERVER_IP || "Not Set";
const DISCORD_LINK = process.env.DISCORD_LINK || "Not Set";
const WEBSITE = process.env.WEBSITE || "Not Set";

// ===== CHECK ENV =====
if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
    console.error("❌ Missing ENV variables (TOKEN / CLIENT_ID / GUILD_ID)");
    process.exit(1);
}

// ===== CLIENT =====
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// ===== COMMANDS =====
const commands = [
    new SlashCommandBuilder().setName('server').setDescription('Get server IP'),
    new SlashCommandBuilder().setName('discord').setDescription('Get Discord link'),
    new SlashCommandBuilder().setName('website').setDescription('Get website link'),
    new SlashCommandBuilder().setName('status').setDescription('Check server status')
].map(cmd => cmd.toJSON());

// ===== REGISTER COMMANDS =====
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log("⏳ Registering commands...");
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log("✅ Commands Registered");
    } catch (err) {
        console.error("❌ Command Register Error:", err);
    }
})();

// ===== COMMAND HANDLER =====
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
        if (interaction.commandName === 'server') {
            const embed = new EmbedBuilder()
                .setColor(0x2b2d31)
                .setTitle("🎮 Join Our Server")
                .setDescription(`**IP:** \`${SERVER_IP}\``);

            return interaction.reply({ embeds: [embed] });
        }

        if (interaction.commandName === 'discord') {
            return interaction.reply(`🔗 ${DISCORD_LINK}`);
        }

        if (interaction.commandName === 'website') {
            return interaction.reply(`🌍 ${WEBSITE}`);
        }

        if (interaction.commandName === 'status') {
            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle("🟢 Server Online")
                .setDescription("All systems working fine!");

            return interaction.reply({ embeds: [embed] });
        }

    } catch (err) {
        console.error(err);
        if (!interaction.replied) {
            interaction.reply("❌ Error occurred");
        }
    }
});

// ===== READY =====
client.once('ready', () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
});

// ===== LOGIN =====
client.login(TOKEN);
