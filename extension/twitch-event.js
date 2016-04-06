var Event = require('../src/event').Event;
const util = require('util');

module.exports.JoinEvent = (function(superclass) {
  util.inherits(JoinEvent, superclass);
  function JoinEvent(channel, username) {
    return superclass.call(this, "twitch-chanel-join", {channel: channel, username: username});
  }
  return JoinEvent;
})(Event);

module.exports.PartEvent = (function(superclass) {
  util.inherits(PartEvent, superclass);
  function PartEvent(channel, username) {
    return superclass.call(this, "twitch-chanel-part", {channel: channel, username: username});
  }
  return PartEvent;
})(Event);

module.exports.ChatEvent = (function(superclass) {
  util.inherits(ChatEvent, superclass);
  function ChatEvent(channel, username, message) {
    return superclass.call(this, "twitch-channel-chat", {channel: channel, username: username, message:message});
  }
  return ChatEvent;
})(Event);

module.exports.ActionEvent = (function(superclass) {
  util.inherits(ActionEvent, superclass);
  function ActionEvent(channel, username, message) {
    return superclass.call(this, "twitch-channel-action", {channel: channel, username: username, message:message});
  }
  return ActionEvent;
})(Event);

module.exports.HostEvent = (function(superclass) {
  util.inherits(HostEvent, superclass);
  function HostEvent(channel, username, count) {
    return superclass.call(this, "twitch-channel-host", {channel: channel, username: username, viewers:count});
  }
  return HostEvent;
})(Event);
