var Entity = require('./entity').Entity;
var uuid = require('uuid');
const util = require('util');

module.exports.Event = (function(superclass) {
  util.inherits(Event, superclass);
  function Event(opts) {
    superclass.call(this, uuid.v4(), opts);
  }
  return Event;
})(Entity);
