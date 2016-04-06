var uuid = require('uuid');
const util = require('util');
var error = require('./error');

var InvalidOptionError = error.InvalidOptionError;

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

/*
module.exports.Relationship = (function() {
  function Relationship(opts) {
    if (opts.s) opts.subject = opts.s;
    if (opts.p) opts.predicate = opts.p;
    if (!opts.subject) return console.error(new InvalidOptionError("'subject' is required"));
    if (!opts.predicate) return console.error(new InvalidOptionError("'predicate' is required"));
    this.subject = opts.subject;
    this.predicate = opts.predicate;
    this.created = new Date();
    Object.getOwnPropertyNames(opts).forEach(function(key) {
      this[key] = opts[key];
    }
  }
  Relationship.prototype.toEdge = function() {
    var e, o, p = {};
    Object.getOwnPropertyNames(this).forEach(function(key) {
      p.key = this[key];
    }
    e.u = this.subject;
    e.v = this.predicate;
    o.e = e;
    o.p = p;
    return o;
  }
  Relationship.prototype.toObject = toObject;
  Relationship.prototype.toJSON = toJSON;
  return Relationship;
})();
  */
