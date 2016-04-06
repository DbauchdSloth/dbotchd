var Entity = require('./entity').Entity;

module.exports.Event = (function(superclass) {
  extend(Event, superclass);
  function Event(opts) {
    Event.__super__.constructor.apply(this, uuid.v4(), opts);
  }
  return Event;
})(Entity);
