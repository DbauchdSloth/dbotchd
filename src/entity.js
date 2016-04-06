module.exports.Entity = (function() {
  function Entity(id, opts) {
    this.id = id;
    this.created = new Date();
    for (var key in opts) {
      this[key] = opts[key];
    }
    this.toVertex = function() {
      var props = {};
      for (var key in this) {
        props.key = this[key];
      }
      return {u:this.id,p:props};
    };
    this.toJSON = function() {
      return JSON.parse(this);
    };
  }
  return Entity;
})();

module.exports.Relationship = (function() {
  function Relationship(opts) {
    /*
    if (!opts.subject || !opts.predicate)
      return console.log("missing one or more required options");
    this.created = new Date();
    for (var key in opts) {
      this[key] = opts[key];
    }
    this.toEdge = function() {
      var props = {};
      for (var key in this) {
        props.key = this[key];
      }
      return {e:{u:this.subject,v:this.predicate},p:props}};
    };
    this.toJSON = function() {
      return JSON.parse(this);
    };
    */
  }
  return Relationship;
})();
