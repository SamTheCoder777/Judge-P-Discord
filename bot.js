// server.js
// where your node app starts

// init project
const http = require("http");
const express = require("express");
const app = express();
const talkedRecently = new Set();

const config = require("./config.json");
var opus = require("opusscript");
const googleIt = require("google-it");

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const Discord = require("discord.js");
const client = new Discord.Client();
const delay = msec => new Promise(resolve => setTimeout(resolve, msec));

client.on("ready", () => {
  console.log("I am Online\nI am Online");
  client.user.setActivity("Helping World President", {
    type: "PLAYING"
  });
});

const prefix = "^";

client.on("message", async message => {
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  let messageArray = message.content.split(" ");
  if (message.content.startsWith(prefix + "google")) {
    let search = message.content.slice("^google".length);
    if (!search) {
      return message.reply("Please state your search");
    }
    googleIt({ query: search, limit: 3, interactive: true })
      .then(results => {
        // access to results object here
        var obj = JSON.stringify(results);
        message.reply(require("util").inspect(results));
      })
      .catch(e => {
        // any possible errors that might have occurred (like no Internet connection)
      });
  }
  if (message.content.startsWith(prefix + "suggest")) {
    let suggestion = message.content.slice("^suggest".length);
    if (!suggestion) {
      message.reply("Sorry, please state your suggetion!");
      message.delete({ timeout: 100 });
      return;
    }
    message.delete({ timeout: 100 });
    message.channel
      .send(`${message.author} has suggested: ` + suggestion)
      .then(message => {
        message.react("👍");
        message.react("👎");
      });
  }
  if (message.content.startsWith(prefix + "fight")) {
    let member = message.mentions.members.first()
    if (talkedRecently.has(message.author.id)){
	    message.channel.send("You are on cooldown! Please wait 1 minute!");
    }else{
    if (!member)
	    return message.channel.send("You forgot to ping a user!");
    talkedRecently.add(message.author.id);
    setTimeout(() => {
          talkedRecently.delete(message.author.id);
        }, 60000);
    message.channel.send(`${message.author}<:MiraSword:724823954912706610>:crossed_swords:<:MiraReverseSword:726910148752310394>${member.user}`);
    }
  }
  if (message.content.startsWith(prefix + "mute")) {
    const role = message.guild.roles.cache.find(role => role.name === "Muted");
    let member = message.mentions.members.first();
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;

    if (!member)
      return message.reply("Please mention a valid member of this server");

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    member.roles.add(role);
    client.channels.cache.get('729063166557814869').send(
      `${member.user.tag} has been muted by ${message.author.tag} because: ${reason}`
    );
    return message.reply(
      `${member.user} has been muted by ${message.author} because: ${reason}`
    );
  }
  
  if (message.content.startsWith(prefix + "tempmute")){
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
      let mutedRole = message.guild.roles.cache.find(role => role.name == "Muted");
      // This is the member you want to mute
      let member = message.mentions.members.first();
      let sec = args.slice(1).join(" ");
      if (!sec || !member){
        return message.reply('Make sure you have pinged the user you want to mute and included time in seconds');
      }
      member.roles.add(mutedRole);
    client.channels.cache.get('729063166557814869').send(
      `${member.user.tag} has been tempmuted by ${message.author.tag} for: ${sec} seconds`
    );
      setTimeout(() => {member.roles.remove(mutedRole);}, sec * 1000);
 }
  
  if (message.content.startsWith(prefix + "unmute")) {
    const role = message.guild.roles.cache.find(role => role.name === "Muted");
    let member = message.mentions.members.first();

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;

    if (!member)
      return message.reply("Please mention a valid member of this server");

    member.roles.remove(role);
    client.channels.cache.get('729063166557814869').send(
      `${member.user.tag} has been unmuted by ${message.author.tag}`
    );
    return message.channel.send(
      `${member.user} has been unmuted by ${message.author}. Please be nice next time!`
    );
  }

  if (message.content.startsWith(prefix + "bd")) {
    if (message.member.hasPermission("BAN_MEMBERS")) {
      let channel = message.mentions.channels.first();
      if (channel == null) {
        message.channel.send("Please provide the channel by pinging it");
        return;
      }
      let announcement = args.slice(1).join(" ");
      channel.send(announcement);
    }
  }
  if (message.content.startsWith(prefix + "announcement")) {
    if (message.member.hasPermission("BAN_MEMBERS")) {
      let channel = message.mentions.channels.first();
      if (channel == null) {
        message.reply("Please provide the channel by pinging it");
        return;
      }
      message.reply("What will be the title?");
      var title;
      const filter = m => m.author.id === message.author.id;
      const collector = message.channel.createMessageCollector(filter, {
        time: 30000
      });

      collector.on("collect", m => {
        title = m.content;
        collector.stop();
      });
      collector.on("end", collected => {
        const collector2 = message.channel.createMessageCollector(filter, {
          time: 30000
        });
        message.reply("What will be the body?");
        var body;
        collector2.on("collect", m => {
          body = m.content;
          collector2.stop();
        });
        collector2.on("end", collected => {
          let embed = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle(title)
            .setAuthor(message.author.tag)
            .setDescription(body)
            .setTimestamp();

          channel.send(embed);
        });
      });
    }
  }

  if (message.author === client.user) return;
  if (message.content.startsWith(prefix + "kick")) {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if (!message.member.hasPermission("KICK_MEMBERS")) return;

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member =
      message.mentions.channels.first() || message.mentions.members.first();
    if (!member)
      return message.channel.send(
        "Please mention a valid member of this server"
      );
    if (!member.kickable)
      return message.channel.send(
        "I cannot kick this user! Do they have a higher role? Do I have kick permissions?"
      );

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    member.send(`Sorry, you have been kicked due to: ${reason}`);
    await delay(100);
    // Now, time for a swift kick in the nuts!
    await member
      .kick(reason)
      .catch(error =>
        message.reply(
          `Sorry ${message.author} I couldn't kick because of : ${error}`
        )
      );
    message.channel.send(
      `${member.user} has been kicked by ${message.author} because: ${reason}`
    );
    client.channels.cache.get('729063166557814869').send(
      `${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`
    );
  }
  if (message.author === client.user) return;
  if (message.content.startsWith(prefix + "ban")) {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if (!message.member.hasPermission("BAN_MEMBERS")) return;

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member =
      message.mentions.channels.first() || message.mentions.members.first();
    if (!member)
      return message.channel.send(
        "Please mention a valid member of this server"
      );
    if (!member.kickable)
      return message.channel.send(
        "I cannot ban this user! Do they have a higher role? Do I have ban permissions?"
      );

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    member.send(`Sorry, you have been banned due to: ${reason}`);
    await delay(100);
    // Now, time for a swift kick in the nuts!

    await member
      .ban(reason)
      .catch(error =>
        message.reply(
          `Sorry ${message.author} I couldn't ban because of : ${error}`
        )
      );
    message.channel.send(
      `${member.user} has been banned by ${message.author} because: ${reason}`
    );
    client.channels.cache.get('729063166557814869').send(
      `${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`
    );
  }

  if (message.content.startsWith(prefix + "ping")) {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(
      `Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`
    );
  }
  if (message.content.startsWith(prefix + "tempban")) {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    let sec = args.slice(2).join(" ");
    if (!message.member.hasPermission("BAN_MEMBERS")) return;

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member =
      message.mentions.channels.first() || message.mentions.members.first();
    if (!member)
      return message.channel.send(
        "Please mention a valid member of this server"
      );
    if (!sec)
      return message.channel.send("Please enter valid time in seconds");
    if (!member.kickable)
      return message.channel.send(
        "I cannot ban this user! Do they have a higher role? Do I have ban permissions?"
      );

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided";

    member.send(`Sorry, you have been banned due to: ${reason}`);
    await delay(100);
    // Now, time for a swift kick in the nuts!

    await member
      .ban(reason)
      .catch(error =>
        message.reply(
          `Sorry ${message.author} I couldn't ban because of : ${error}`
        )
      );
    message.channel.send(
      `${member.user} has been tempbanned by ${message.author} because: ${reason} for: ${sec}`
    );
    client.channels.cache.get('729063166557814869').send(
      `${member.user.tag} has been tempbanned by ${message.author.tag} because: ${reason} for: ${sec}`
    );
    setTimeout(() => {message.guild.members.unban(member);}, sec * 1000);
  }
  //TODO make help command (edit it)
  if (message.content.startsWith(prefix + "help")) {
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("OH NO! Do you need help?")
      .setAuthor("Help Page for Judge P")
      .addFields(
        { name: "\u200B", value: "\u200B" },
        {
          name: "^suggest",
          value: "Use this command when you are suggesting something!\n"
        },
        { name: "^avatar", value: "shows your avatar\n" },
        { name: "^ping", value: "shows your ping\n" },
        { name: "^online", value: "shows how many users are online\n" },
        {
          name: "\u200B",
          value: "\b EXPERIMENTAL FEATURES (NOT PERFECT!!!) \b"
        },
        {
          name: "^google {search}",
          value: "DISCAIMER: NO NSFW!!! It googles...That's it...\n"
        },
        { name: "\u200B", value: "\b MODERATOR COMMANDS \b" },
        {
          name: "^ban {@user} {reason}",
          value: "Bans a user and msgs the ban msg to the user\n"
        },
        {
          name: "^kick {@user} {reason}",
          value: "Kicks a user and msgs the kick msg to the user\n"
        },
        {
          name: "^bd {#channel} {message}",
          value: "broadcasts in a mentioned channel\n"
        },
        { name: "^mute {@user} {reason}", value: "mutes a user\n" },
        { name: "^unmute {@user}", value: "unmutes a user\n" },
	{ name: "^tempmute {@user} {seconds}", value: "mutes a user for a given seconds"},
	{ name: "^tempban {@user} {reason (optional)} {seconds}", value: "bans a user for a given seconds"},
        { name: "^announcement {@channel}", value: "announcement"}
      )
      .setImage("https://cdn.wallpapersafari.com/74/70/mEIxu0.png")
      .setTimestamp()
      .setFooter("This bot is programmed by 5amgamer");
    message.channel.send(embed);
  }

  //avatar
  if (message.content.startsWith(prefix + "avatar")) {
    var member = message.mentions.users.first();
    if (!member) member = message.author;

    let embed = new Discord.MessageEmbed()
      .setImage(member.avatarURL())
      .setColor("#275BF0");
    message.channel.send(embed);
  }

  //members
  if (message.content.startsWith(prefix + "online")) {
    message.guild.members.fetch().then(fetchedMembers => {
      const totalOnline = fetchedMembers.filter(
        member => member.presence.status === "online"
      );
      // We now have a collection with all online member objects in the totalOnline variable
      message.channel.send(`Currently ${totalOnline.size} members are online!`);
    });
  }
});
//voice chat thing starats here

//TODO: Make voice chat

// client.on("message", async message => {
//   // Voice only works in guilds, if the message does not come from a guild,

//   const ytdl = require("ytdl-core");
//   if (!message.guild) return;
//   const args = message.content
//     .slice(config.prefix.length)
//     .trim()
//     .split(/ +/g);
//   const command = args.shift().toLowerCase();
//   const fs = require("fs");
//   if (message.content.startsWith(prefix + "join")) {
//     // Only try to join the sender's voice channel if they are in one themselves
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       // Create a dispatcher

//       connection.play(
//         ytdl("https://www.youtube.com/watch?v=P-uhgIzHYYo", {
//           filter: "audioonly"
//         })
//       );

//       if (!message.member.voice.channel) {
//         message.reply("You need to join a voice channel first!");
//       }
//     }

//     //voice thing
//   }
// });

client.login(process.env.TOKEN);
