var tmi = require("tmi.js");
var jsonfile = require('jsonfile');
var defaultChannel = "#dbauchdsloth";

var client;

process.on("SIGINT", function() {
  console.log("closing [SIGNINT]");
  client.disconnect();
  process.exit();
})


var onConnecting = function (address, port) {
  
};

var onConnected = function (address, port) {

};

var onDisconnect = function (reason) {

};

jsonfile.readFile("config.json", function (err, opts) {
  if (err) {
    console.dir(err);
  }
  client = new tmi.client(opts);
  client.on("connecting", onConnecting);
  client.on("connected",  onConnected);
  client.on("disconnect", onDisconnect);
  client.connect();
});
