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

module.exports.Relationship = (function() {
  function Relationship(opts) {
    this.created = new Date();
    this.subject = opts.subject || return console.error(new Error("missing subject"));
    this.predicate = opts.predicate || return console.error(new Error("missing subject"));
    for (var key in opts) {
      this[key] = opts[key];
    }
  }
  Relationship.prototype.toEdge = function() {
    var p = {};
    Object.getOwnPropertyNames(this).forEach(function(key) { p.key = this[key]; });
    return {e: {u: this.subject, v: this.predicate}, p: p};
  }
  Relationship.prototype.toObject = toObject;
  Relationship.prototype.toJSON = function() { return JSON.stringify(this.toObject()) };
  return Relationship;
})();

()();
