require("dotenv").config({
  path: require("path").resolve(".env"),
});
const { REST } = require("@discordjs/rest");
const {
  Routes,
  ApplicationCommandOptionType,
} = require("discord-api-types/v10");

const playerOption = {
  name: "player",
  description: "The player to view kick history of",
  type: ApplicationCommandOptionType.String,
  required: true,
};

const commands = [
  {
    name: "bans",
    description: "View a players ban history",
    options: [playerOption],
  },
  {
    name: "kicks",
    description: "View a players kick history",
    options: [playerOption],
  },
  {
    name: "mutes",
    description: "View a players mute history",
    options: [playerOption],
  }
];

const token = process.env.DISCORD_BOT_TOKEN ?? "";
const id = process.env.DISCORD_CLIENT_ID ?? "";

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("[Discord API] Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(id), { body: commands });
    console.log(
      "[Discord API] Successfully reloaded application (/) commands."
    );
  } catch (error) {
    console.error(error);
  }
})();
