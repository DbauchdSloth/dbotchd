var uuid = require('uuid');
const util = require('util');

function toObject() {
  var o = {}
  Object.getOwnPropertyNames(this).forEach(function(key) {
    o.key = this[key];
  });
  return o;
}

module.exports.Entity = (function() {
  function Entity(id, opts) {
    this.id = id || uuid.v4();
    this.created = new Date();
    for (var key in opts) {
      this[key] = opts[key];
    }
  }
  Entity.prototype.toVertex = function() {
    var p = {};
    Object.getOwnPropertyNames(this).forEach(function(key) { p.key = this[key]; });
    return {u: this.id, p: p };
  }
  Entity.prototype.toObject = toObject;
  Entity.prototype.toJSON = function() { return JSON.stringify(this.toObject()) };
  return Entity;
})();
