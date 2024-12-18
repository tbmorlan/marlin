const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true})
bot.commands = new Discord.Collection();

bot.config = require("./botconfig.json");

fs.readdir("./commands", (err,files) => {
if(err) console.log(err);

let jsfile = files.filter(f => f.split(".").pop() === "js")
if(jsfile.length <= 0){
    console.log("Couldn't find command.");
    return;
}

jsfile.forEach((f, i) =>{
let props = require(`./commands/${f}`);
console.log(`${f} loaded!`)
bot.commands.set(props.help.name, props);
});

});

bot.on("ready", async () => {
console.log(`${bot.user.username} is online!`);
bot.user.setStatus('online')
bot.user.setPresence({ game: { name: '>help | marlinbot.com', type: "watching"}});
});

bot.on('error', error => console.error(error));

bot.on("message", (message) => {
    const prefix = ">";
    if(!message.content.startsWith(prefix)) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot,message,args);

});

bot.login(botconfig.token);
