//Webex Bot Starter - featuring the webex-node-bot-framework - https://www.npmjs.com/package/webex-node-bot-framework

var framework = require('webex-node-bot-framework');
var webhook = require('webex-node-bot-framework/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(express.static('images'));
const config = require("./config.json");

// init framework
var framework = new framework(config);
framework.start();
console.log("Starting framework, please wait...");

framework.on("initialized", function () {
  console.log("framework is all fired up! [Press CTRL-C to quit]");
});

// A spawn event is generated when the framework finds a space with your bot in it
// If actorId is set, it means that user has just added your bot to a new space
// If not, the framework has discovered your bot in an existing space
framework.on('spawn', (bot, id, actorId) => {
  if (!actorId) {
    // don't say anything here or your bot's spaces will get
    // spammed every time your server is restarted
    console.log(`While starting up, the framework found our bot in a space called: ${bot.room.title}`);
  } else {
    // When actorId is present it means someone added your bot got added to a new space
    // Lets find out more about them..
    var msg = 'You can say `help` to get the list of words I am able to respond to.';
    bot.webex.people.get(actorId).then((user) => {
      msg = `Hello there ${user.displayName}. ${msg}`; 
    }).catch((e) => {
      console.error(`Failed to lookup user details in framwork.on("spawn"): ${e.message}`);
      msg = `Hello there. ${msg}`;  
    }).finally(() => {
      // Say hello, and tell users what you do!
      if (bot.isDirect) {
        bot.say('markdown', msg);
      } else {
        let botName = bot.person.displayName;
        msg += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@mention* ${botName}.`;
        bot.say('markdown', msg);
      }
    });
  }
});


//Process incoming messages

let responded = false;
/* On mention with command
ex User enters @botname help, the bot will write back in markdown
*/
framework.hears(/help|what can i (do|say)|what (can|do) you do/i, function (bot, trigger) {
  console.log(`someone needs help! They asked ${trigger.text}`);
  responded = true;
  bot.say(`Hello ${trigger.person.displayName}.`)
    .then(() => sendHelp(bot))
    .catch((e) => console.error(`Problem in help hander: ${e.message}`));
});


//Total Count of Clients
framework.hears('Client Count', function (bot) {
  console.log("Client Count in the location");
  responded = true;

var myHeaders = newHeaders ();
myHeaders.append("Content.Type", "application/json");
myHeaders.append("Authorization", "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYnkiOiJMb2NhdGlvbiIsInR5cGUiOiJCZWFyZXIiLCJ0ZW5hbnRJZCI6MTc3NjksInVzZXJuYW1lIjoieWFjeHVAY2lzY28uY29tIiwia2V5SWQiOiI3M2FkYWQ0NC0yYjQwLTRhOTEtOGMwOS0zYzUxZjQ5YmQwMDYiLCJ1c2VySWQiOjI0MjY3LCJpYXQiOjE1OTQwODkzMzMsImV4cCI6MTYwMTg2NTMzM30.1gS2jWgara12uYQwsqhwDIYYN9lhGNnSXv01JCrrxhs")
var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

var output = fetch("https://dnaspaces.io/api/location/v1/clients/count", requestOptions)
  .then (response=> response.json())
  .then (data=>{
  	var total = data.results.total
  	console.log ('Client count is ${total}')
  	bot.say('The number of clients in the current location is: ${total}');
  })
  .then (result => console.log(result))
  .catch (error => console.log('error', error));
});

// maintnance areas

framework.hears('Maintnance Areas', function (bot) {
  console.log("Avoided Areas");
  responded = true;
var myHeaders = newHeaders ();
myHeaders.append("Content.Type", "application/json");
myHeaders.append("Authorization", "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYnkiOiJMb2NhdGlvbiIsInR5cGUiOiJCZWFyZXIiLCJ0ZW5hbnRJZCI6MTc3NjksInVzZXJuYW1lIjoieWFjeHVAY2lzY28uY29tIiwia2V5SWQiOiI3M2FkYWQ0NC0yYjQwLTRhOTEtOGMwOS0zYzUxZjQ5YmQwMDYiLCJ1c2VySWQiOjI0MjY3LCJpYXQiOjE1OTQwODkzMzMsImV4cCI6MTYwMTg2NTMzM30.1gS2jWgara12uYQwsqhwDIYYN9lhGNnSXv01JCrrxhs")
var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

var output = fetch("https://dnaspaces.io/api/location/v1/map/elements/floor", requestOptions)
  .then (response=> response.json())
  .then (data=>{
  	var total = data.results.total
  	console.log ('Avoid the following floors ${total}')
  	bot.say(' Please avoid the following areas: ${total}');
  })
  .then (result => console.log(result))
  .catch (error => console.log('error', error));
});

//Office Admin
framework.hears('Office Admin', function (bot) {
	  console.log('Office Admin Info Requested');
	  responded = true;
	  bot.say('The Office Admin is Tara Ward');
	});

//Sanitization Stations
framework.hears('Sanitization Stations', function (bot) {
	  console.log('Sanitization Station info requested');
	  responded = true;
	  bot.say('Sanitization Stations are located at the following: lobby Area, cafeteria, mail room');
	});


/* On mention with unexpected bot command
   Its a good practice is to gracefully handle unexpected input
*/
framework.hears(/.*/, function (bot, trigger) {
  // This will fire for any input so only respond if we haven't already
  if (!responded) {
    console.log(`catch-all handler fired for user input: ${trigger.text}`);
    bot.say(`Sorry, I don't know how to respond to "${trigger.text}"`)
      .then(() => sendHelp(bot))
      .catch((e) => console.error(`Problem in the unexepected command hander: ${e.message}`));
  }
  responded = false;
});

function sendHelp(bot) {
  bot.say("markdown", 'These are the commands I can respond to:', '\n\n ' +
    '1. **Client Count**   (clients per floor) \n' +
    '2. **Maintnance Areas**  (Maintnace zones in process of being cleaned) \n' +
    '3. **Office Admin**  (get details about office admin) \n' +
    '4. **Sanitization Stations** (get details about the location of sanitization stations) \n' );

}


//Server config & housekeeping
// Health Check
app.get('/', function (req, res) {
  res.send(`I'm alive.`);
});

app.post('/', webhook(framework));

var server = app.listen(config.port, function () {
  framework.debug('framework listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function () {
  framework.debug('stoppping...');
  server.close();
  framework.stop().then(function () {
    process.exit();
  });
});