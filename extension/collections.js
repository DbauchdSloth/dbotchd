var loki = require('lokijs');

/* wrapper module for persistent collections */
module.exports = function(username) {

  // TODO: proposed persistence partitioning scheme
  // use one store to index other stores (by file path and name conventions)
  //var pusersdb    = new loki("db/otchd/" + username + "/users.json");
  //var peventsdb   = new loki("db/otchd/" + username + "/events.json");
  //var pactivitydb = new loki("db/otchd/" + username + "/activity.json");
  //var usersdb     = new loki("db/otchd/users.json");
  //var gamesdb     = new loki("db/otchd/games.json");
  //var activitydb  = new loki("db/otchd/activity.json");

  var lokiConfig = {
    autosave: true,
    autosaveInternal: 1000,
    autoLoad: true
  };

  var mediadb = new loki(username + '-media.json', lokiConfig);

  var userdb  = new loki('user-store.json', lokiConfig);
  var eventdb = new loki('event-store.json', lokiConfig);
  var gamedb  = new loki('game-store.json', lokiConfig);

  // simple persistent loki collections
  this.events         = eventdb.addCollection('events');
  this.users          = userdb.addCollection('users',    { indices: [ "_id" ] });
  this.channels       = userdb.addCollection('channels', { indices: [ "_id" ] });
  this.follows        = userdb.addCollection('follows'); // same format as 'users'
  this.chatProperties = userdb.addCollection('chatProperties', { indices: [ "username" ] });
  this.currentHosts   = userdb.addCollection('currentHosts');
  this.games          = gamedb.addCollection('games', { indices: [ "_id" ] });
  this.topGames       = gamedb.addCollection('topGames');
  this.playlist       = mediadb.addCollection('playlist');

  this.save = function() {
    eventdb.save();
    userdb.save();
    gamedb.save();
    mediadb.save();
  }

  return this;
}
