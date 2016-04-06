var Entity = require('../src/entity').Entity;
const util = require('util');

Event = (function(superclass) {
  util.inherits(Event, superclass);
  function Event(type, opts) {
    superclass.constructor.apply(this, uuid.v4(), opts);
  }
  Event.prototype.toObject = function() {
    return superclass.toObject();
  }
  return Event;
})(Entity);

module.exports.JoinEvent = (function(superclass) {
  util.inherits(JoinEvent, superclass);
  function JoinEvent(channel, username) {
    return superclass.constructor.apply(this, "twitch-chanel-join", {channel: channel, username: username});
  }
  return JoinEvent;
})(Event);

module.exports.PartEvent = (function(superclass) {
  util.inherits(PartEvent, superclass);
  function PartEvent(channel, username) {
    return superclass.constructor.apply(this, "twitch-chanel-part", {channel: channel, username: username});
  }
  return PartEvent;
})(Event);

module.exports.ChatEvent = (function(superclass) {
  util.inherits(ChatEvent, superclass);
  function ChatEvent(channel, username, message) {
    return superclass.constructor.apply(this, "twitch-channel-chat", {channel: channel, username: username, message:message});
  }
  return ChatEvent;
})(Event);

module.exports.ActionEvent = (function(superclass) {
  util.inherits(ActionEvent, superclass);
  function ActionEvent(channel, username, message) {
    return superclass.constructor.apply(this, "twitch-channel-action", {channel: channel, username: username, message:message});
  }
  return ActionEvent;
})(Event);

module.exports.HostEvent = (function(superclass) {
  util.inherits(HostEvent, superclass);
  function HostEvent(channel, username, count) {
    return superclass.constructor.apply(this, "twitch-channel-host", {channel: channel, username: username, viewers:count});
  }
  return HostEvent;
})(Event);
