var img;

var balls = [];

var radiusLow = 10;
var radiusHigh = 20;
var rangeLow = 0.5;
var rangeHigh = 1;


function preload(){
	img = loadImage("img/vermeer.jpg");
}

function setup() {

	// createCanvas(img.width, img.height);
  createCanvas(windowWidth, windowHeight);

	background(255);

	textAlign(CENTER);
	// text("Click and hold here!!", width/2, height/2);


}

function draw(){

	//var c = color(img.get(current.location.x, current.location.y));
	//var greyscale = round(red(c) * 0.222 + green(c) * 0.707 + blue(c) * 0.071);

	for (var i = 0; i < balls.length; i++){
			balls[i].draw();
			balls[i].update();
			balls[i].changeColour();
	}

	for (var i = 0; i < balls.length; i++){
			if (balls[i].radius < 0){
					balls.splice(i, 1);
			}
	}

	if (mouseIsPressed){

			for (var i = 0; i < 5; i++){
					balls.push(new Ball(mouseX, mouseY, color(img.get(mouseX+random(2), mouseY+random(2)))));
			}

	}

}


class Ball{

			//start where the user clicks
			//move up from where the user has clicked
					//become smaller as it moves up
			//be drawn to the screem

			constructor(mX, mY, c){
					this.location = createVector(mX, mY);
					this.radius = random(.01);
					this.r = red(c);
					this.g = green(c);
					this.b = blue(c);

					this.xOff = 0.0;
					this.yOff = 0.0;

					this.radiusLow;
					this.radiusHigh;

					this.rangeLow;
					this.rangeHigh
			}

			update(){
					this.radius -= random(0.0001);

					this.xOff = this.xOff + random(-0.5, 0.5);
					this.nX = noise(this.location.x) * this.xOff;

					this.yOff = this.yOff + random(-0.5, 0.5);
					this.nY = noise(this.location.y) * this.yOff;

					this.location.x += this.nX;
					this.location.y += this.nY;

			}

			changeColour(){

					this.c = color(img.get(this.location.x, this.location.y));

					this.r = red(this.c);
					this.g = green(this.c);
					this.b = blue(this.c);
			}

			draw(){
					noStroke();
					stroke(this.r, this.g, this.b);
					//line(this.location.x-(this.location.x*this.radius), this.location.y, this.location.x+(this.location.x*this.radius), this.location.y)
					ellipse(this.location.x, this.location.y, this.radius * 50, this.radius * 50);
			}
	}