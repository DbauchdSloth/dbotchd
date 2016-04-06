const util = require('util');
const Event = require('../src/event').Event;

module.exports.JoinEvent = (function(superclass) {
  util.inherits(JoinEvent, superclass);
  function JoinEvent(channel, username) {
    var e = superclass.constructor.apply(this, {channel: channel, username: username});
    e.prototype.eventType = "twitch-chanel-join";
    return e;
  }
  return JoinEvent;
})(Event);

module.exports.PartEvent = (function(superclass) {
  util.inherits(PartEvent, superclass);
  function PartEvent(channel, username) {
    var e = superclass.constructor.apply(this, {channel: channel, username: username});
    e.prototype.eventType = "twitch-channel-part";
    return e;
  }
  return PartEvent;
})(Event);

module.exports.ChatEvent = (function(superclass) {
  util.inherits(ChatEvent, superclass);
  function ChatEvent(channel, username, message) {
    var e = superclass.constructor.apply(this, {channel: channel, username: username, message:message});
    e.prototype.eventType = "twitch-channel-chat";
    return e;
  }
  return ChatEvent;
})(Event);

module.exports.ActionEvent = (function(superclass) {
  util.inherits(ActionEvent, superclass);
  function ActionEvent(channel, username, message) {
    var e = superclass.constructor.apply(this, {channel: channel, username: username, message:message});
    e.prototype.eventType = "twitch-channel-action";
    return e;
  }
  return ActionEvent;
})(Event);

module.exports.HostEvent = (function(superclass) {
  util.inherits(HostEvent, superclass);
  function HostEvent(channel, username, count) {
    var e = superclass.constructor.apply(this, {channel: channel, username: username, viewers:count});
    e.prototype.eventType = "twitch-channel-host";
    return e;
  }
  return HostEvent;
})(Event);
