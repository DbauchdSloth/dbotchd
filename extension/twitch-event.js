const util = require('util');
const Event = require('../src/event').Event;

module.exports.JoinEvent = (function(superclass) {
  util.inherits(JoinEvent, superclass);
  function JoinEvent(channel, username) {
    this.eventType = "twitch-chanel-join";
    return superclass.constructor.apply(this, {channel: channel, username: username});
  }
  return JoinEvent;
})(Event);

module.exports.PartEvent = (function(superclass) {
  util.inherits(PartEvent, superclass);
  function PartEvent(channel, username) {
    this.eventType = "twitch-channel-part";
    return superclass.constructor.apply(this, {channel: channel, username: username});
  }
  return PartEvent;
})(Event);

module.exports.ChatEvent = (function(superclass) {
  util.inherits(ChatEvent, superclass);
  function ChatEvent(channel, username, message) {
    this.eventType = "twitch-channel-chat";
    return superclass.constructor.apply(this, {channel: channel, username: username, message:message});
  }
  return ChatEvent;
})(Event);

module.exports.ActionEvent = (function(superclass) {
  util.inherits(ActionEvent, superclass);
  function ActionEvent(channel, username, message) {
    this.eventType = "twitch-channel-action";
    return superclass.constructor.apply(this, {channel: channel, username: username, message:message});
  }
  return ActionEvent;
})(Event);

module.exports.HostEvent = (function(superclass) {
  util.inherits(HostEvent, superclass);
  function HostEvent(channel, username, count) {
    this.eventType = "twitch-channel-host";
    return superclass.constructor.apply(this, {channel: channel, username: username, viewers:count});
  }
  return HostEvent;
})(Event);
