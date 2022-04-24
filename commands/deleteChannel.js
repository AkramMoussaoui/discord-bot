const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("supprimer")
    .setDescription(
      'Supprime tout les channels avec le nom donné.\n\nExemple : `/supprimer Frigg`'
    )
    .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Le nom du channel à supprimer")
      .setRequired(true))
    ,
  async execute(interaction, client) {
    const { name, type } = interaction.options.getChannel("channel")
    const names = [];
    names.push(name);
    if(type == "GUILD_VOICE"){
      names.push(name.replace(" ", "-").replace("'", "").toLowerCase());
    }
    const permissions = interaction.memberPermissions.has("MANAGE_CHANNELS")
    if(!permissions){
      await interaction.reply("Vous n'avez pas les permissions nécessaires pour effectuer cette action.");
      return
    }
  
    const channelIds = client.channels.cache.filter(c => names.includes(c.name)).map(c => c.id);
    let deletedChannels = 0;

    for(let id of channelIds) {
        const channel = client.channels.cache.get(id);

        // Check if channel is a voice or text
        if(channel.type != 'GUILD_VOICE' && channel.type != 'GUILD_TEXT') continue

        // Check if text channels are empty and delete them
        if(channel.type === 'GUILD_TEXT') {
            const messages = await channel.messages.fetch({ limit: 100 })
            if(messages.size > 0) {
                continue
            }
        }

        channel.delete();
        deletedChannels++;
    }
    await interaction.reply(`Vous avez supprimé les channels suivants : ${names.join(', ')}. ${deletedChannels} channels supprimés au total.`);
    return
  },
};