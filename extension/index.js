var fs   = require('fs');
var argv = require('minimist')(process.argv.slice(2));
const EventEmitter = require('events');
const util = require('util');
var express = require('express');
var uuid = require('uuid');

var routes           = require('./routes');
//var commmandDispatch = require('./commands');
var twitchService    = require('./twitch-api');

app = express();

function DbotchdEventEmitter() {
  EventEmitter.call(this);
}
util.inherits(DbotchdEventEmitter, EventEmitter);
const emitter = new DbotchdEventEmitter();

function isDev() {
  return process.env.NODE_ENV !== "production"
}

module.exports = function(nodecg) {

  // process arguments;
  var username = argv.u ? argv.u : "default";
  var secret   = argv.o ? argv.o : "secret";
  var twitchConfigPath   = argv.t ? argv.t : "./twitch-conf.json";

  var twitchConfig = {
  	options: {
  		debug: false
  	},
    connection: {
        cluster: "aws",
        reconnect: true
    },
  	identity: {
  		username: username,
  		password: secret
  	},
  	channels: ["#" + username]
  };

  var twitch = twitchService(emitter, username, secret, twitchConfig);
  twitch.connect();
  //var command = commmandDispatch(emitter, twitch);

  app.use('/api/', routes);
  //app.use('/twitch/,' twitch.router);

  nodecg.mount(app);

  app.on("mount", function(nodecg) {
    //twitch.cacheUser(username);
  });

  var shutdown = function() {
    console.log("disconnecting from Twitch API");
    twitch.disconnect();
    nodecg.close(function() {
      console.log("Closed out remaining connections.");
      process.exit()
    });
    setTimeout(function() {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit()
    }, 10*1000);
  }
  process.on ('SIGTERM', shutdown);
  process.on ('SIGINT', shutdown);

}
