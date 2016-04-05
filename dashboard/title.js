
var mainTitle = nodecg.Replicant("mainTitle", {defaultValue: "DbauchdSloth"}));
var altTitle  = nodecg.Replicant("altTitle", {defaultValue: "Starting Soon"});

document.querySelector('#title-submit').addEventListener('click', function(e) {
  mainTitle = document.getElementById('main-title').value;
  atlTitle = document.getElementById('alt-title').value;
})
