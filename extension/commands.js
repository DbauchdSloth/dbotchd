module.exports = function(emitter, twitch) {

  function onCommandDispatch = function(command, username, content) {
    if (command === "!ut") {
      // TODO: show uptime of current video if running, and total uptime last 24 hours
      twitch.client.action("#" + username,
        "bot has been running since " + started.toUTCString());
    }
    if (command === "!so") {
      var argPattern = RegExp("^(!\\w+)\\s+(\\w+)");
      if (!argPattern.test(message)) {
        twitch.client.action("#" + username,
          "You had one job, %s", user);
      }
      match = argPattern.exec(content);
      var streamer = match[1];
      twitch.client.action("#" + username,
        "Please give %s a follow at %s and say hi for me!", streamer, "twitch.tv/" + streamer);
    }
  }

  emitter.on("command-dispatch", onCommandDispatch);

  return this;
};
