var loki    = require('lokijs');
var irc     = require('tmi.js');
var uuid    = require('uuid');
var express = require('express');

const util = require('util');
const digraph = require('../src/digraph');
const entity  = require('../src/entity');

var DirectedGraph = digraph.DirectedGraph;
var Entity        = entity.Entity;
var Relationship  = entity.Relationship;
//var Relationship  = entity.Relationship;

var twitchEvent = require('./twitch-event');
var JoinEvent   = twitchEvent.JoinEvent;
var PartEvent   = twitchEvent.PartEvent;
var HostEvent   = twitchEvent.HostEvent;
var ChatEvent   = twitchEvent.ChatEvent;
var ActionEvent = twitchEvent.ActionEvent;

var User = (function(superclass) {
  util.inherits(User, superclass);
  function User(username) {
    return superclass.call(this, username, {username: username});
  }
  return User;
})(Entity);

var Channel = (function(superclass) {
  util.inherits(Channel, superclass);
  function Channel(username) {
    return superclass.call(this, username, {name: username});
  }
  return Channel;
})(Entity);

module.exports = function(emitter, username, secret, config) {

  var started = new Date();

  var lokiConfig = {
    autosave: true,
    autosaveInterval: 1000
  };

  // TODO: encapsulate collection configuration and init in twitch-collection.js

  var channeldb = new loki('twitch-channel.json', lokiConfig);
  var channels  = channeldb.addCollection('channels');

  var socialdb = new loki('twitch-' + username + '-social-graph.json');
  var entities = socialdb.addCollection('entities');
  var relationships = socialdb.addCollection('relationships');
  var socialGraph = new DirectedGraph("twitch-" + username + "-social");

  var userdb = new loki('twitch-' + username + '.json', lokiConfig);
  var users      = userdb.addCollection('users');
  var hosting    = userdb.addCollection('hosting');
  var follows    = userdb.addCollection('follow');
  var events     = userdb.addCollection('event');

  this.client = new irc.client(config);

  this.cacheChannel = function(name) {
    //var channel = channels.findObject({"name": {"$eq": name}});
    if (!channel) { // always cache channels for now
      client.api({
        url: "https://api.twitch.tv/kraken/channels/" + name
      }, function(err, res, body) {
        if (err) return console.error(err);
        var tchannel = JSON.parse(body);
        var channel = new Channel(name);
        channels.insert(channel);
        vres = socialGraph.addVertex(channel.toVertex());
        if (vres.error) return console.error(vres.error);
        //entities.insert(vres.result);
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
    var user = users.findObject({"username": {"$eq": name}});
    if (!user) {
      this.client.api({
        url: "https://api.twitch.tv/kraken/users/" + name
      }, function(err, res, body) {
        if (err) return console.error(err);
        var tuser = JSON.parse(body);
        var user = new User(tuser.username);
        users.insert(user);
        vres = socialGraph.addVertex(user.toVertex());
        if (vres.error) return console.error(vres.error);
        //entities.insert(vres.result);
      });
    }
  }

  function onConnected(address, port) {
    //var event = new Event({address: address, port: port});
    //even.eventType = "server-connected"; // FIXME: refactor Event constructor
    //console.dir(event);
  }

  function onJoin(channel, user) {
    var event = new JoinEvent(channel, user);
    events.insert(event);
    var user = users.findObject({"username": {"$eq": username}});
    cacheUser(user);
  }

  function onPart(channel, username) {
    var event = new PartEvent(channel, username);
    events.insert(event);
  };

  function onHosted(channel, user, viewers) {
    var ts = new Date();
    console.log("%s [%s] <%s> host %s", ts.toUTCString(), channel, user, viewers);
    var event = new HostEvent(channel, user, viewers);
    events.insert(event);
    cacheUser(user);
  }

  function onChat(channel, user, message, self) {
    var ts = new Date();
    console.log("%s [%s] <%s> %s", ts.toUTCString(), channel, user.username, message);
    var event = new ChatEvent(channel, user.username, message);
    events.insert(event);
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
    var event = new ActionEvent(channel, user.username, message);
    events.insert(event);
    cacheUser(user.username);
    var commandPattern = new RegExp("^!\\w+");
    if (commandPattern.test(message)) {
      var command = commandPattern.exec(message);
      emitter.emit("command-dispatch", command, user.username, message);
    }
  };

  this.say = function(channel, message) {
    this.client.say(channel, message);
  }

  this.client.on("connected", onConnected);
  this.client.on("join", onJoin);
  this.client.on("part", onPart);
  this.client.on("hosted", onHosted);
  this.client.on("chat", onChat);
  this.client.on("action", onAction);

  // still needed?
  emitter.on('cache-user', this.cacheUser);
  emitter.on('cache-channel', this.cacheChannel);
  emitter.on('cache-channel-hosting', this.cacheChannelHosting);
  emitter.on('cache-channel-follows', this.cacheChannelFollows);

  this.router = express.Router();

  /*
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
*/
  // register new router for every new user identified so they get their own base loki file registered once

  this.connect = function() {
    this.client.connect();
  };

  return this;
};
