var loki = require('lokijs');

/* wrapper module for persistent collections */
module.exports = function() {

  var userdb  = new loki('user-store.json');
  var eventdb = new loki('event-store.json');
  var gamedb  = new loki('game-store.json');

  // simple persistent loki collections
  var events         = eventdb.addCollection('events');

  var users          = userdb.addCollection('users',    { indices: [ "_id" ] });
  var channels       = userdb.addCollection('channels', { indices: [ "_id" ] });
  var follows        = userdb.addCollection('follows'); // same format as 'users'
  var chatProperties = userdb.addCollection('chatProperties', { indices: [ "username" ] });
  var currentHosts   = userdb.addCollection('currentHosts');

  var games          = gamedb.addCollection('games', { indices: [ "_id" ] });
  var topGames       = gamedb.addCollection('topGames');

  this.events = events;
  this.users = users;
  this.channels = channels;
  this.follows = follows;
  this.chatProperties = chatProperties;
  this.currentHosts = currentHosts;
  this.games = games;
  this.topGames = topGames;

  this.save = function() {
    eventdb.save();
    userdb.save();
    gamedb.save();
  }

  return this;
}
