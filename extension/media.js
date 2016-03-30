module.exports = {
  Image: function(url, opt) {
    this.url = url || "#";
    this.type = opt.type || "image/png";
    this.toJson: function() {
      reuturn {image:{url:this.url}};
    }
    return this;
  },
  Video: function(url, opt) {
    return this;
  },
  Stream: function(url, opt) {
    return this;
  },
  Audio: function(url, opt) {
    return this;
  }
};
