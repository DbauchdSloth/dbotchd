var Entity = require('./entity').Entity;
const util = require('util');

module.exports.Event = (function(superclass) {
  util.inherits(Event, superclass);
  function Event(opts) {
    superclass.constructor.apply(this, uuid.v4(), opts);
  }
  return Event;
})(Entity);
