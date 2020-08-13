// server.js
// where your node app starts

// init project
const http = require("http");
const express = require("express");
const app = express();
const talkedRecently = new Set();
const warned1 = new Set();
const warned2 = new Set();
const wasMuted = new Set();
var status = "Helping World President";

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
  client.user.setActivity("Sumi best girl", {
    type: "PLAYING"
  });
});

client.on('guildMemberAdd', member => {
    const role = member.guild.roles.cache.find(role => role.name === "Muted");
    if(wasMuted.has(member.id))
	    member.roles.add(role);
    if(warned1.has(member.id))
	    member.roles.add('729796826416414790');
    else if(warned2.has(member.id))
	    member.roles.add('729796899670065162');
});

const prefix = "^";

client.on("message", async message => {
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  let messageArray = message.content.split(" ");
  if (message.content.startsWith(prefix + "clear")){
	if (!message.member.hasPermission("MANAGE_MESSAGES")) return;	
	const args = message.content.split(' ').slice(1); // All arguments behind the command name with the prefix
	const amount = args.join(' '); // Amount of messages which should be deleted

	if (!amount) return message.reply('You haven\'t given an amount of messages which should be deleted!'); // Checks if the `amount` parameter is given
	if (isNaN(amount)) return message.reply('The amount needs to be a number!'); // Checks if the `amount` parameter is a number. If not, the command throws an error

	if (amount > 100) return message.reply('You can`t delete more than 100 messages at once!'); // Checks if the `amount` integer is bigger than 100
	if (amount < 1) return message.reply('You have to delete at least 1 message!'); // Checks if the `amount` integer is smaller than 1

	await message.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
	    message.channel.bulkDelete(messages // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
	)});	  
  }
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
  if (message.content.startsWith(prefix + "clwarn")) {
	if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
      	let warn1 = message.guild.roles.cache.get('729796826416414790');
	let warn2 = message.guild.roles.cache.get('729796899670065162');
	let member = message.mentions.members.first();
	if (!member) return message.reply("Please ping the user");
	member.roles.remove(warn1);
	member.roles.remove(warn2);
	warned1.delete(member.id);
	warned2.delete(member.id);
	message.channel.send("Done!");
	client.channels.cache.get('729063166557814869').send(
      	`${member.user.tag}'s warns are cleared by ${message.author.tag}`
  	);
  }
  if (message.content.startsWith(prefix + "warn")) {
	if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
	let warn1 = message.guild.roles.cache.get('729796826416414790');
	let warn2 = message.guild.roles.cache.get('729796899670065162');
	let member = message.mentions.members.first();
	let reason = args.slice(1).join(" ");
	if (!reason)
		return message.channel.send("please provide a reason");
	if (member.roles.cache.has('729796826416414790')) {
		member.roles.add(warn2);
		member.roles.remove(warn1);
		message.channel.send(`${member.user}, this is your second warn for: ${reason}`);
		member.send(`${member.user}, you have been warned (2nd time) for: ${reason}`);
	    	client.channels.cache.get('729063166557814869').send(
      		`${member.user.tag} has been warned (2nd time) for: ${reason}`
    		);
		warned1.delete(member.id);
		warned2.add(member.id);
	}
	else if (member.roles.cache.has('729796899670065162')) {
		message.channel.send(`${message.author}, this is ${member.user}'s 3rd warn! Oh look! A ban?`);
		member.send(`${member.user}, you have been warned (3rd time!!!!!) for: ${reason}`);
	    	client.channels.cache.get('729063166557814869').send(
      		`${member.user.tag} has been warned (3rd time... Ban?) for: ${reason}`
    		);
		warned2.delete(member.id);
   		 await member
      		.ban(7)
		.catch(error =>
        	message.reply(
          	`Sorry ${message.author} I couldn't ban because of : ${error}`
        	)
      		);
		message.channel.send(`${member.user} got banned. Reason: 3 warns`);
	}
	else{
		member.roles.add(warn1);
		message.channel.send(`${member.user}, this is your first warn for: ${reason}`);
		member.send(`${member.user}, you have been warned (first time) for: ${reason}`);
	    	client.channels.cache.get('729063166557814869').send(
      		`${member.user.tag} has been warned (first time) for: ${reason}`
    		);
		warned1.add(member.id);
	}
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
    wasMuted.add(member.id);
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
        return message.reply('Make sure you have pinged the user you want to mute and included time in minutes');
      }
      if (isNaN(sec)) return message.reply('The amount needs to be a number!');
	  
      member.roles.add(mutedRole);
	message.channel.send(`${member.user.tag} has been tempmuted for: ${sec} minutes`);
    wasMuted.add(member.id);
    client.channels.cache.get('729063166557814869').send(
      `${member.user.tag} has been tempmuted by ${message.author.tag} for: ${sec} minutes`
    );
      setTimeout(() => {member.roles.remove(mutedRole);    wasMuted.delete(member.id);}, sec * 60000);
 }
  
  if (message.content.startsWith(prefix + "unmute")) {
    const role = message.guild.roles.cache.find(role => role.name === "Muted");
    let member = message.mentions.members.first();

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;

    if (!member)
      return message.reply("Please mention a valid member of this server");

    member.roles.remove(role);
    wasMuted.delete(member.id);
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
      .ban({days:7,reason: reason})
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
    let sec = args[1];
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
      return message.channel.send("Please enter valid time in days");
    if (!member.kickable)
      return message.channel.send(
        "I cannot ban this user! Do they have a higher role? Do I have ban permissions?"
      );

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(2).join(" ");
    if (!reason) reason = "No reason provided";

    member.send(`Sorry, you have been temp banned due to: ${reason} for: ${sec} days`);
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
      `${member.user} has been tempbanned by ${message.author} because: ${reason} for: ${sec} days`
    );
    client.channels.cache.get('729063166557814869').send(
      `${member.user.tag} has been tempbanned by ${message.author.tag} because: ${reason} for: ${sec} days`
    );
    setTimeout(() => {message.guild.members.unban(member);}, sec * 86,400,000);
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
        { name: "^fight {@user}", value: "fights the user\n" },
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
        { name: "^warn {@user} {reason}", value: "warns a user\n" },
        { name: "^clwarn {@user}", value: "clears all warns of a user\n" },
        { name: "^mute {@user} {reason}", value: "mutes a user\n" },
        { name: "^unmute {@user}", value: "unmutes a user\n" },
	{ name: "^tempmute {@user} {minutes}", value: "mutes a user for a given minutes"},
	{ name: "^tempban {@user} {days} {reason (optional)}", value: "bans a user for a given days"},
        { name: "^announcement {@channel}", value: "announcement"},
	{ name: "^clear {number}", value: "clears certain number of messages"},
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
