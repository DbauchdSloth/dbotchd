var _ = require("lodash");
var tmi = require("tmi.js");
var jsonfile = require('jsonfile');
var defaultChannel = "#dbauchdsloth";
var commandRegex = /^!\w+/;
var commands = [];
var client;
var followers = [];

process.on("SIGINT", function() {
  console.log("closing [SIGNINT]");
  client.disconnect();
  process.exit();
});

var onConnecting = function (address, port) {
  jsonfile.readFile("commands.json", function (err, defaultCommands) {
    if (err) {
      console.trace(err);
      process.exit();
    }
    commands = defaultCommands.commands;
  });
};

var onConnected = function (address, port) {
  getFollowers(defaultChannel);
};

var onDisconnect = function (reason) {

};


/*

!command add <name> <response>
!command remove <name>
!command edit <name> <response>

!counter add <name> [filname]
!counter reset <name>
!counter remove <name>
!counter set <name> <#>
!counter check <name>

!list add <name>
!list push <name> <string>
!list pop <name>
!list <name>
!list remove <name>
!list reset <name>

!status <string>
!game <string>

*/

var getFollowers = function (channel) {
  var total = 0;

  var url = "https://api.twitch.tv/kraken/channels/dbauchdsloth/follows?limit=100"

  client.api({ url: url },
    function (err, res, body) {
      if (err) {
        console.trace(err);
      }
      obj = JSON.parse(body);
      total = obj._total;
      followers.push(obj.follows);
  });
  //TODO: loop until all followers are GET and pushed
};

var onChat = function (channel, user, message, self) {
  var results = commandRegex.exec(message);
  if (results) {
    var command = results[0];
    console.dir(command);
    var out = _.result(_.find(commands, { "in": command }), "out");
    if (out) {
      client.say(defaultChannel, out);
    }
  }
};

jsonfile.readFile("config.json", function (err, opts) {
  if (err) {
    console.trace(err);
    process.exit();
  }
  client = new tmi.client(opts);
  client.on("connecting", onConnecting);
  client.on("connected",  onConnected);
  client.on("disconnect", onDisconnect);
  client.on("chat",       onChat);
  client.connect();
});
