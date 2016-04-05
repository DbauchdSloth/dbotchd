var irc  = require('tmi.js');
var collections = require('./collections');

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

  var db = collections();
  var client = new irc.client(config);
  client.connect();

  this.cacheChannel = function(name) {
    client.api({
      url: "https://api.twitch.tv/kraken/channels/" + name
    }, function(err, res, body) {
      if (err) return console.error(err);
      var channel = JSON.parse(body);
      if (!channels.get(channel._id)) { // really needed or insert sure to be overwrite?
        db.channels.insert(channel);
      }
    });
    return true;
  };

  this.cacheUser = function(name) {
    client.api({
      url: "https://api.twitch.tv/kraken/users/" + name
    }, function(err, res, body) {
      if (err) return console.error(err);
      var user = JSON.parse(body);
      if (!users.get(user._id)) {
        db.users.insert(user);
      }
    });
    return true;
  };

  this.getUserId = function(name) {
    client.api({
      url: "https://api.twitch.tv/kraken/users/" + name
    }, function(err, res, body) {
      if (err) return console.error(err);
      console.dir(JSON.parse(body));
    });
  }

  this.getUser = function(name) {
    if (!name) return console.error("missing argument");
    var userId = this.getUserId(name);
    if (!userId) return console.error("missing result");
    if (!db.users.get(userId)) {
      this.cacheUser(name);
    }
    return db.users.get(userId);
  }

  this.cacheGames = function(limit, offset) {
    var qoffset = "";
    if (offset) qoffset = "&offset=" + offset;
    client.api({
      url: "https://api.twitch.tv/kraken/games/top?limit=" + limit + qoffset
    }, function(err, res, body) {
      if (err) return console.error(err);
      var response = JSON.parse(body);
      db.topGames.insert(response.top);
      for (var i in response.top) {
        var game = response.top[i].game;
        if(game && !games.get(game._id)) {
          games.insert(game);
        }
      }
    });
    return true;
  }

  this.findGames = function(name) {

  };

  this.cacheChatProperties = function(name) {
    client.api({
      url: "https://api.twitch.tv/api/channels/" + name + "/chat_properties"
    }, function(err, res, body) {
      if (err) return console.error(err);
      var chatProps = JSON.parse(body);
      db.chatProperties.insert(chatProps);
    });
    return true;
  };

  this.getChatProperties = function(name) {
    if (!name) return console.error("missing argument");
    if (!db.chatProperties.get(name)) {
      this.cacheChatProperties(name);
    }
    return db.chatProperties.get(name);
  };

  this.onConnected = function(address, port) {
    var ts = new Date();
    var event = {
      created: ts.toUTCString(),
      type: "connected",
      address: address,
      port: port
    };
    db.events.insert(event);
    return true;
  };

  this.onJoin = function(channel, user) {
    var ts = new Date();
    console.log("%s [%s] <%s> join", ts.toUTCString(), channel, user);
    var event = {
      created: ts.toUTCString(),
      type: "join",
      channel: channel,
      username: user
    };
    db.events.insert(event);
    db.events.insert(new Event("join", {channel: channel, username: user}));
    if (!db.users.findObject({"username": { "$eq": user}})) {
      emitter.emit("cache-user", user);
    }
  };

  this.onPart = function(channel, user) {
    var ts = new Date();
    console.log("%s [%s] <%s> part", ts.toUTCString(), channel, user.username);
    var event = {
      created: ts.toUTCString(),
      type: "part",
      channel: channel,
      username: user.username
    };
    db.events.insert(event);
  };

  this.onHosted = function(channel, user, viewers) {
    var ts = new Date();
    console.log("%s [%s] <%s> host %s", ts.toUTCString(), channel, user, viewers);
    var event = {
      created: ts.toUTCString(),
      type: "hosted",
      channel: channel,
      username: user,
      viewers: viewers
    };
    db.events.insert(event);
    //if (isDev()) console.dir(event);
    if (!db.users.findObject({"username": { "$eq": user.username}})) {
      emitter.emit("cache-user", user.username);
    }
    emitter.emit("refresh-current-hosts");
  };

  this.connect = function() {
    client.connect();
  }

  client.on("chat", function(channel, user, message, self) {
    var ts = new Date();
    console.log("%s [%s] <%s> %s", ts.toUTCString(), channel, user.username, message);
    db.events.insert({
      created: ts.toUTCString(),
      type: "chat",
      channel: channel,
      username: user.username,
      message: message
    });
    if (!db.users.findObject({"username": {"$eq": user.username }})) {
      emitter.emit("cache-user", user.username);
    }
    var commandPattern = new RegExp("^!\\w+");
    if (commandPattern.test(message)) {
      var command = commandPattern.exec(message);
      emitter.emit("dispatch-command", command, user.username, message);
    }
  });

  client.on("action", function(channel, user, message, self) {
    var ts = new Date();
    console.log("%s [%s] <*%s> %s", ts.toUTCString(), channel, user.username, message);
    db.events.insert({
      created: ts.toUTCString(),
      type: "action",
      channel: channel,
      user: user.username,
      message: message
    });
    if (!db.users.findObject({"username": {"$eq": user.username }})) {
      emitter.emit("cache-user", user.username);
    }
  });

  // TODO: allow limit > 100
  emitter.on('refresh-recent-follows', function(name, limit) {
    //console.log('refresh-recent-follows');
    client.api({
      url: "https://api.twitch.tv/kraken/channels/" + name + "/follows?limit=" + limit
    }, function(err, res, body) {
      if (err) return console.error(err);
      var response = JSON.parse(body);
      db.follows.removeDataOnly();
      db.follows.insert(response.follows);
    });
  });

  emitter.on('dispatch-command', function(command, user, message) {
    var ts = new Date();
    var event = {
      created: ts.toUTCString(),
      type: "dispatch-command",
      channel: "#" + username,
      command: command,
      username: user.username,
      message: message
    };
    db.events.insert(event);
    //if (isDev()) console.dir(event);
    if (command == "!ut") {
      // TODO: show uptime of current video if running, and total uptime last 24 hours
      client.action("#" + username,
        "bot has been running since " + started.toUTCString());
    }
    if (command == "!so") {
      var argPattern = RegExp("^(!\\w+)\\s+(\\w+)");
      if (!argPattern.test(message)) {
        client.action("#" + username,
          "You had one job, %s", user);
      }
      match = argPattern.exec(message);
      var streamer = match[1];
      client.action("#" + username,
        "Please give %s a follow at %s and say hi for me!", streamer, "twitch.tv/" + streamer);
    }
  });

  emitter.on('refresh-current-hosts', function(name) {

  });


  client.on("connected", this.onConnected);
  client.on("join", this.onJoin);
  client.on("part", this.onPart);
  client.on("hosted", this.onHosted);
  emitter.on('cache-user', this.cacheUser);
  emitter.on('cache-channel', this.cacheChannel);
  emitter.on('cache-games', this.cacheGames);
  emitter.on('cache-chat-properties', this.cacheChatProperties);

  return this;
};
