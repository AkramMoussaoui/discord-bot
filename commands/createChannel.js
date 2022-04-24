const { SlashCommandBuilder } = require("@discordjs/builders");
const { guildId } = require('../config');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("creer")
    .setDescription(
      'Crée des channels de test'
    ),
  async execute(interaction) {
    const guildID = interaction.guild.id;
    const permissions = interaction.memberPermissions.has("MANAGE_CHANNELS")
    const names = ["Frigg's Messengers", "Heimdall Buddies", "Balder's Jackals"];
    if(!permissions || guildID != guildId){
      await interaction.reply("Vous n'avez pas les permissions nécessaires pour effectuer cette action.");
      return
    }
    const parentID = interaction.guild.channels.cache.filter(c => c.name === "Test").map(c => c.id)[0];
    const parent = interaction.guild.channels.cache.get(parentID);
    for(let name of names) {
        for(let i = 0; i < 2; i++) {
            await interaction.guild.channels.create(name, {
                type: "GUILD_VOICE",
                parent
            });
            await interaction.guild.channels.create(name, {
                type: "GUILD_TEXT",
                parent
            });
        }
    }
    
    await interaction.reply(`Les channels ont été créé.`);
    return
  },
};