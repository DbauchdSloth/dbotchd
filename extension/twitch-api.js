var loki = require('lokijs');
var irc  = require('tmi.js');
var uuid = require('uuid');
var express = require('express');

//var collections = require('./collections');
function Event(type, opts) {  //var e = new Event(type, args);
  this.id = uuid.v4();
  this.type = type;
  this.created = new Date();
  for (var key in opts) {
    this[key] = opts[key];
  }
  return this;
}

module.exports = function(emitter, username, secret, config) {

  var started = new Date();

  var channeldb = new loki('db/twitch/channel.json');
  var cahnnels  = channeldb.addCollection('channels');

  var userdb = new loki('db/twitch/' + username + '/user.json', lokiConfig);
  var users      = userdb.addCollection('users');
  var hosting    = userdb.addCollection('hosting');
  var follows    = userdb.addCollection('follow');
  var events     = userdb.addCollection('event');

  this.client = new irc.client(config);

  this.cacheChannel= function(name) {
    var channel = channels.findObject({"name": name});
    if (!channel) {
      client.api({
        url: "https://api.twitch.tv/kraken/channels/" + name
      }, function(err, res, body) {
        if (err) return console.error(err);
        channel = JSON.parse(body);
        channels.insert(channel);
      });
      cacheChannelHosting(name);
      cacheChannelFollows(name);
    }
  }

  this.cacheChannelHosting = function(name) {

  }

  this.cacheChannelFollows = function(name) {

  }

  this.cacheUser = function(name) {
    var user;
    user = users.findObject({"username": name});
    if (!user) {
      client.api({
        url: "https://api.twitch.tv/kraken/users/" + name
      }, function(err, res, body) {
        if (err) return console.error(err);
        user = JSON.parse(body);
        users.insert(user);
      });
      cacheChannel(name);
    }
  }

  function onConnected(address, port) {
    var ts = new Date();
    var event = {
      created: ts.toUTCString(),
      type: "connected",
      address: address,
      port: port
    };
    events.insert(event);
    return true;
  }

  function onJoin(channel, user) {
    var ts = new Date();
    console.log("%s [%s] <%s> join", ts.toUTCString(), channel, user);
    var event = {
      created: ts.toUTCString(),
      type: "join",
      channel: channel,
      username: user
    };
    events.insert(event);
    cacheUser(user);
  }

  function onPart(channel, user) {
    var ts = new Date();
    console.log("%s [%s] <%s> part", ts.toUTCString(), channel, user.username);
    var event = {
      created: ts.toUTCString(),
      type: "part",
      channel: channel,
      username: user.username
    };
    events.insert(event);
  };

  function = isExis

  function onHosted(channel, user, viewers) {
    var ts = new Date();
    console.log("%s [%s] <%s> host %s", ts.toUTCString(), channel, user, viewers);
    var event = {
      created: ts.toUTCString(),
      type: "hosted",
      channel: channel,
      username: user,
      viewers: viewers
    };
    events.insert(event);
    cacheUser(user.username);
  }

  function onChat(channel, user, message, self) {
    var ts = new Date();
    console.log("%s [%s] <%s> %s", ts.toUTCString(), channel, user.username, message);
    events.insert({
      created: ts.toUTCString(),
      type: "chat",
      channel: channel,
      username: user.username,
      message: message
    });
    cacheUser(user.username);
    var commandPattern = new RegExp("^!\\w+");
    if (commandPattern.test(message)) {
      var command = commandPattern.exec(message);
      emitter.emit("command-dispatch", command, user.username, message);
    }
  }

  function onAction(channel, user, message, self) {
    var ts = new Date();
    console.log("%s [%s] <*%s> %s", ts.toUTCString(), channel, user.username, message);
    events.insert({
      created: ts.toUTCString(),
      type: "action",
      channel: channel,
      user: user.username,
      message: message
    });
    cacheUser(user.username);
  };

  client.on("connected", onConnected);
  client.on("join", onJoin);
  client.on("part", onPart);
  client.on("hosted", onHosted);
  client.on("chat", onChat);
  client.on("action", onAction);

  emitter.on('cache-user', this.cacheUser);
  emitter.on('cache-channel', this.cacheChannel);
  emitter.on('cache-channel-hosting', this.cacheChannelHosting);
  emitter.on('cache-channel-follows', this.cacheChannelFollows);

  this.router = express.Router();
  this.router.get('/channel/:name', function(req, res) {
    cacheChannel(req.params.name);
    return res.json(channels.find({"name": req.params.name}));
  });
  this.router.get('/channel/:name/hosting', function(req, res) {
    cacheChannel(req.params.name);
    return res.json(hosting.find());
  });
  this.router.get('/channel/:name/follows', function(req, res) {
    cacheChannel(req.params.name);
    return res.json(follows.find());
  });

  return this;
};
