var yPos = 0;
function setup() {
  frameRate(30);
}
function draw() {
  background(204);
  yPos = yPos - 1;
  if (yPos < 0) {
    yPos = height;
  }
  line(0, yPos, width, yPos);
}