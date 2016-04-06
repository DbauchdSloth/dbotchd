const util = require('util');

module.exports.InvalidOptionError = (function(superclass) {
  util.inherits(InvalidOptionError, superclass);
  function InvalidOptionError(message) {
    this.prototype.name = "InvalidOptionError";
    this.prototype.message = "invalid option: '" + message + "'";
  }
  return InvalidOptionError;
})(Error);
