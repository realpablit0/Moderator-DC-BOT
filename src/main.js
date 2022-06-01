/*========== npm module imports ==========*/
const { SlasherClient } = require("discord.js-slasher");

/*========== event handle imports ==========*/
// command handlers
const moderatorInfo = require('./commandHandle/moderator-info.command')

const client = new SlasherClient({ useAuth: true });

var commandPermissions;

const getPermissionDict = (guild) => {
    const roles = guild.roles.cache.map(role => role)
    return {
        'moderator-info': {
            'function': moderatorInfo,
            'permission': guild.roles.everyone
        }
    }
}

const fetchGuild = (id) => {
    return new Promise((resolve, reject) => {
        const guilds = client.guilds.cache.map(guild => guild);
        const guild = Object.values(guilds).find(guild => `${guild.id}` === `${id}`);
        resolve(guild);
    })
}

client.on("ready", () => {
    console.log("Logged in as " + client.user.tag);
    fetchGuild(`${require('../auth.json').guild}`).then(guild => {
        commandPermissions = getPermissionDict(guild)
    })
});

const executeCommand = (ctx) => {
    commandPermissions[ctx.name].function(ctx)
}

client.on("command", (ctx) => {
    executeCommand(ctx)
});

client.login();