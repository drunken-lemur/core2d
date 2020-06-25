var img = new Image();
img.onload = draw;
img.src = "//i.stack.imgur.com/cZ0gC.png";
var ctx = c.getContext("2d");

function draw() {
  // draw color
  ctx.fillStyle = "#09f";
  ctx.fillRect(0, 0, c.width, c.height);

  // set composite mode
  ctx.globalCompositeOperation = "destination-in";

  // draw image
  ctx.drawImage(this, 0, 0);
}

// Example using second approach:

var img = new Image();
img.onload = draw;
img.src = "//i.stack.imgur.com/cZ0gC.png";
var ctx = c.getContext("2d");

function draw() {
  // draw image
  ctx.drawImage(this, 0, 0);

  // set composite mode
  ctx.globalCompositeOperation = "source-in";

  // draw color
  ctx.fillStyle = "#09f";
  ctx.fillRect(0, 0, c.width, c.height);
}
