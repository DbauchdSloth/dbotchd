var font = {
  a: [ 0,1,1,1,0, 0,0,0,0,1, 0,1,1,1,1, 1,0,0,0,1, 0,1,1,1,1 ],
  b: [ 1,1,1,1,0, 1,0,0,0,1, 1,1,1,1,0, 1,0,0,0,1, 1,1,1,1,1 ],
  c: [ 0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,0, 1,0,0,0,1, 0,1,1,1,0 ],
  d: [ 1,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,0 ],
  h: [ 1,0,0,0,1, 1,0,0,0,1, 1,1,1,1,1, 1,0,0,0,1, 1,0,0,0,1 ],
  l: [ 1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,0, 1,0,0,0,0, 1,1,1,1,1 ],
  o: [ 0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0 ],
  t: [ 1,1,1,1,1, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0 ]
};
// we create a monochrome "screen" using sprites as "pixels", with a max
// bounding box of 10px by 10px or a radius of 5px
var matrix = {
  width: 128,
  height: 72
}

var pixels = [];

$(function() {
  $('.tlt').textillate({loop:true, minDisplayTime: 8000});

})

/*
$(document).ready(function() {
  //$('#title-sequence').textillate({ callback: function() { console.log('title sequence complete'); } });

  var s = Snap("#svg");

  // TODO: refactor magic numbers
  //var drawTitle = function(s) {
    var tx, ty = 0;
    for (var char in "dbauchdsloth") {
      var glyph = font[char];
      for (var x = 0; x < 5; x++) {
        for (var y = 0; y < 5; y++) {
          //var p = s.circle(tx, ty, 5 * font[char][x + (y * 5)]); // radius 0 or 5
          if (!font[char][x + (y * 5)]) { continue; }
          var p = s.circle(tx, ty, 0.1);
          p.attr({
            fill: "#ffffff",
            stroke: "#ffffff",
            strokeWidth: 1
          });
          p.animate({
            r: 5
          }, 1000);
          pixels.push(p);
          ty += 10;
        }
        tx += 10;
      }
      tx += 10; // one pixel width betweeen glyphs
    }
  //};

});
*/
