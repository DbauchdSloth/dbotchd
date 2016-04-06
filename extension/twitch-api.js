var loki    = require('lokijs');
var irc     = require('tmi.js');
var uuid    = require('uuid');
var express = require('express');

var util  = require('../src/util');
var digraph = require('../src/digraph');
var entity  = require('../src/entity');

var extend = util.extend;
var DirectedGraph = digraph.DirectedGraph;
var Entity        = entity.Entity;
var Relationship  = entity.Relationship;

var User = (function(superclass) {
  extend(User, superclass);
  function User(username) {
    return User.__super__.constructor.apply(this, username, {username: username});
  }
  return User;
})(Entity);

var Channel = (function(superclass) {
  extend(Channel, superclass);
  function Channel(username) {
    return User.__super__.constructor.apply(this, username, {username: username});
  }
  return Channel;
})(Entity);

var Event = (function(superclass) {
  extend(Event, superclass);
  function Event(opts) {
    Event.__super__.constructor.apply(this, uuid.v4(), opts);
  }
  return Event;
})(Entity);

var JoinEvent = (function(superclass) {
  extend(JoinEvent, superclass);
  function JoinEvent(channel, username) {
    this.eventType = "irc-join";
    return User.__super__.constructor.apply(this, {channel: channel, username: username});
  }
  return JoinEvent;
})(Event);

var PartEvent = (function(superclass) {
  extend(PartEvent, superclass);
  function PartEvent(channel, username) {
    this.eventType = "irc-part";
    return User.__super__.constructor.apply(this, {channel: channel, username: username});
  }
  return PartEvent;
})(Event);

module.exports = function(emitter, username, secret, config) {

  this.started = new Date();

  var lokiConfig = {
    autosave: true,
    autosaveInterval: 1000
  };

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


  this.cacheChannel= function(name) {
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
    if (!user) {
      cacheUser(user);
    }
  }

  function onPart(channel, username) {
    var event = new PartEvent(channel, user);
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
    if (!user) {
      cacheUser(user);
    }
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
  };

  this.disconnect = function() {
    this.client.disconnect();
  };

  return this;
};
