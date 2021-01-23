/* LANCE LE SERVEUR AVEC : node bot.js */

/* 
** INVITE LE BOT AVEC CE LIEN 
** https://discord.com/oauth2/authorize?client_id=775776920444207105&scope=bot
*/

const { Client, MessageEmbed } = require('discord.js');
const auth = require('./auth.json');


// Initialize Discord Bot
const client = new Client();
client.login(auth.token);

client.on('ready', (evt) => {
    console.log('Connected');
    console.log('Logged in as: ', client.user.username);
    console.log('Tag: ', client.user.tag);
});

client.on('message', function (message) {
    // Notre client doit savoir s’il doit executer une commande
    // Il sera réceptif en message placés après `!`
    // console.log('user: ', user +'\n','ID: ', userID);
    // console.log('channelID: ', channelID +'\n','message: ', message);
    // console.log('evt: ', evt);

    console.log("content", message.content);
    console.log("channel", message.channel);

    var content = message.content;
    
    if (content.substring(0, 2) == '::') {
        var args = content.substring(2).split(' ');
        var cmd = args.shift();
     
        switch(cmd.toLowerCase()) {
            // !intro
            case 'intro':
                message.channel.send('Bonjour :D')
                break;
            case 'ping':
                message.channel.send('pong')
                break;
            case 'sondage':
                sondage(message);
                break;
            case 'roll':
                roll(message);
                break;
            default:
                message.channel.send('I don\'t understand')
                break;
            // Ajouter si vous souhaitez d’autres commandes
         }
     }
});

function roll(message)
{
    var args = message.content.substr(message.content.indexOf(' ')).split(' '); args.shift();
    var msg = '';
    var somme = 0;
    var dice = 0;
    var nb_lance = args[0];

    console.log("arg =>",  args);

    if (args.length > 2 || args.length <= 0) {
        message.channel.send("```\nToo few or too many arguments\nTry again with:\n::roll {nbr_dice} {dice}\n```")
        return
    }

    msg = "```\n";
    msg += message.author.username + "\n";
    while (nb_lance)
    {
        dice = Math.floor(Math.random() * (args[1] - 1 + 1)) + 1;
        somme += dice;
        msg += dice + "\n";
        nb_lance -= 1;
    }
    
    if (args[0] > 1) msg += "total:" + somme;
    msg += "\n```";

    message.channel.send(msg)
}

// !sondage choix1 choix2 ...

function sondage(message) {

    var msg = '';
    var reaction = '';
    var nbr_letter = ['0\uFE0F\u20E3', '1\uFE0F\u20E3', '2\uFE0F\u20E3', '3\uFE0F\u20E3', '4\uFE0F\u20E3', '5\uFE0F\u20E3', '6\uFE0F\u20E3', '7\uFE0F\u20E3', '8\uFE0F\u20E3', '9\uFE0F\u20E3'];
    var args = message.content.substr(message.content.indexOf(' ')).split(',');
    var title = args.shift();

    if (args[args.length - 1] === "") args.pop();


    // client.sendMessage({
    //     to: channelID,
    //     message: 'Too many arguments\nTry again with:\n!sondage choice1, choice2,..., choice10' 
    // });
    console.log(args.length);    
    if (args.length > 9 || args.length <= 0) {
        message.channel.send("```\nToo few or too many arguments\nTry again with:\n::sondage choice1, choice2,..., choice10\n```")
        return
    }

    args.forEach((element, i) => {
        reaction += 'keycap: '+ i
        element = element.trim()
        msg += nbr_letter[i]+' '+element+'\n';
    });

    var sondage = new MessageEmbed()
    .setTitle('Sondage: \n' + title)
    .setColor()
    .setDescription(msg)
    // .addField(msg);

    client.channels.cache.get(message.channel.id).send(sondage).then(msg_send => {
        args.forEach((el, i) =>{
            msg_send.react(nbr_letter[i]);
        })
    })

    return
}