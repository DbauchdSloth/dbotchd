var loki = require('lokijs');
var jsgraph = require('jsgraph');
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

function DirectedGraph(name) {
  var res = jsgraph.directed.create();
  if (res.error) return console.error(res.error);
  var graph = res.result;
  graph.name = name;
  return graph;
}

module.exports = function(emitter, username, secret, config) {

  this.started = new Date();

  var socialdb = new loki('twitch-' + username + '-social-graph.json')
  var nodes = socialdb.addCollection('nodes');
  var edges = socialdb.addCollection('edges');
  var socialGraph = new DirectedGraph("twitch-social");

  var lokiConfig = {
    autosave: true,
    autosaveInterval: 1000
  };

  var channeldb = new loki('twitch-channel.json', lokiConfig);
  var channels  = channeldb.addCollection('channels');

  var userdb = new loki('twitch-' + username + '.json', lokiConfig);
  var users      = userdb.addCollection('users');
  var hosting    = userdb.addCollection('hosting');
  var follows    = userdb.addCollection('follow');
  var events     = userdb.addCollection('event');

  this.client = new irc.client(config);

  this.cacheChannel= function(name) {
    //var channel = channels.findObject({"name": {"$eq": name}});
    if (!channel) { // always cache channels for now
      client.api({
        url: "https://api.twitch.tv/kraken/channels/" + name
      }, function(err, res, body) {
        if (err) return console.error(err);
        channel = JSON.parse(body);
        channels.insert(channel);
        var node = {
          type: "channel",
          created: channel.created_at,
          updated: channel.updated_at,
          mature: channel.mature,
          status: channel.status,
          displayName: channel.displayName,
          game: channel.game,
          id: channel._id,
          name: channel.name,
          media: [
            { image { name: "logo", href: channel.logo} },
            { image { name: "banner", href: channel.banner} },
            { image { name: "video-banner", href: channel.video_banner} },
            { image { name: "profile-banner", href: channel.profile_banner} }
          ],
          stats: [
            { name: "follow-count", value: channel.followers },
            { name: "view-count", value: channel.views },
          ]
        }});
        var vres = socialGraph.addVertex({u: channel.id, p: node});
        if (vres.error) return console.error(res.error);
        nodes.insert(vres.result);
      }
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
        user = JSON.parse(body);
        users.insert(user);
        var node =  {
          type: "user",
          created: user.created_at,
          updated: user.updated_at,
          id: user._id,
          username: user.username
        };
        var vres = socialGraph.addVertex({u: user.id, p: node});
        if (vres.error) return console.error(vres.error);
        nodes.insert(vres.result);
      });
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
    console.log("%s [%s] <%s> part", ts.toUTCString(), channel, user);
    var event = {
      created: ts.toUTCString(),
      type: "part",
      channel: channel,
      username: user
    };
    events.insert(event);
  };

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

  this.say = function(channel, message) {
    this.client.say(channel, message);
  }

  this.client.on("connected", onConnected);
  this.client.on("join", onJoin);
  this.client.on("part", onPart);
  this.client.on("hosted", onHosted);
  this.client.on("chat", onChat);
  this.client.on("action", onAction);

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

  // register new router for every new user identified so they get their own base loki file registered once

  this.connect = function() {
    this.client.connect();
  }

  this.disconnect = function() {
    this.client.disconnect();
  };

  return this;
};
