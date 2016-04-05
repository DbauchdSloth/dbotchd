$(function() {
  $('.tlt').textillate({loop:true, minDisplayTime: 8000});
})

nodecg.Replicant('altTitle').on('change', function(oldValue, newValue) {
  document.getElementById("alt-title").textContent = newValue;
});
