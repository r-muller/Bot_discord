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
    console.log('Logged in as: ', client.user.tag);
});

client.on('message', function (message) {
    // Notre client doit savoir s’il doit executer une commande
    // Il sera réceptif aux messages placés après `::`
    
    if (message.content.substring(0, 2) == '::') {

        var content = message.content;
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
         }
     }
});

// ::roll nbr_dice dice
// Ex:( ::roll 1 20)
function roll(message)
{
    var msg;
    var somme = 0;
    var dice = 0;
    var nb_lance;

    var args = message.content.substr(message.content.indexOf(' ')).split(' ');
    args.shift();
    nb_lance = args[0];

    if (args.length > 2 || args.length <= 0) {
        message.channel.send("```\nToo few or too many arguments\nTry again with:\n::roll {nbr_dice} {dice}\n```")
        return
    }

    // DEBUT du message
    msg = "```\n";
    msg += message.author.username + "\n";
    while (nb_lance)
    {// CREATION du message plus LANCE de Des
        dice = Math.floor(Math.random() * (args[1] - 1 + 1)) + 1;
        somme += dice;
        msg += dice + "\n";
        nb_lance -= 1;
    }
    if (args[0] > 1) msg += "total:" + somme; // AJOUT de la ligne TOTAL si il y a plusieurs lance
    msg += "\n```";
    // FIN du message

    message.channel.send(msg)
}

// ::sondage {title}, {choix}, ..., {choix 10}
// Ex: (::sondage l'aile ou la cuisse, l'aile, la cuisse)
function sondage(message)
{
    var msg = '';
    var nbr_letter = ['0\uFE0F\u20E3', '1\uFE0F\u20E3', '2\uFE0F\u20E3', '3\uFE0F\u20E3', '4\uFE0F\u20E3', '5\uFE0F\u20E3', '6\uFE0F\u20E3', '7\uFE0F\u20E3', '8\uFE0F\u20E3', '9\uFE0F\u20E3'];
    var args = message.content.substr(message.content.indexOf(' ')).split(',');
    var title = args.shift();

    if (args[args.length - 1] === "") args.pop();
    if (args.length > 10 || args.length <= 0) {
        message.channel.send("```\nToo few or too many arguments\nTry again with:\n::sondage {title}, {choix}, ..., {choix 10}\n```")
        return
    }

    // CREATION du message
    args.forEach((element, i) => {
        element = element.trim()
        msg += nbr_letter[i]+' '+element+'\n';
    });

    // CREATION du sondage
    var sondage = new MessageEmbed()
    .setTitle('Sondage: \n' + title)
    .setDescription(msg)

    // ENVOIE du sondage et AJOUT des reactions
    client.channels.cache.get(message.channel.id).send(sondage).then(msg_send => {
        args.forEach((el, i) =>{
            msg_send.react(nbr_letter[i]);
        })
    })
}