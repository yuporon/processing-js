// *********************************************
//
//   WANDERING PARTICLES
//   by André Casey, 2017
//   www.andrecasey.com
//  
//   Adaptation of the particles example from 
//   sketch.js by Justin Windle into Processing
//   using p5js. 
//   https://github.com/soulwire/sketch.js
//
// *********************************************


// ----------------------------------------
// Configuration
// ----------------------------------------

// GLOBALS
var MAX_PARTICLES = 1700;
//var COLORS = [ '#31CFAD', '#ADDF8C', '#FF6500', '#FF0063', '#520042', '#DAF7A6' ];
var COLORS = [ '#69D2E7', '#27DBD8', '#50E46C', '#3386FF', '#FA69FA', '#FF4E50', '#F9D423' ];
//var COLORS = [ '#581845', '#900C3F', '#C70039', '#C70039', '#FFC300', '#DAF7A6' ];
//var COLORS = [ 'rgba(49,207,173,.7)', 'rgba(173,223,140,.7)', 'rgba(255,101,0,.7)', 'rgba(255,0,99,.7)', 'rgba(82,0,66,.7)' ];

//ARRAYS
var particles = [];
var pool = [];

//VARIABLES
var wander1 = 0.5;
var wander2 = 2.0;
var drag1 = .9;
var drag2 = .99;
var force1 = 2;
var force2 = 8;
var theta1 = -0.5;
var theta2 = 0.5;
var size1 = 5;
var size2 = 180;
var sizeScalar = 0.95;


// ----------------------------------------
// Particle Functions
// ----------------------------------------

function Particle(x,y,size) {
    this.alive = true;
    this.size = size || 10;
    this.wander = 0.15;
    this.theta = random( TWO_PI );
    this.drag = 0.92;
    this.color = "#FFFFFF"; //random( COLORS );
  	this.location = createVector(x || 0.0, y || 0.0);
	this.velocity = createVector(0.0, 0.0);
}
Particle.prototype.move = function() {
    this.location.add(this.velocity);
  	this.velocity.mult(this.drag);
    this.theta += random( theta1, theta2 ) * this.wander;
    this.velocity.x += sin( this.theta ) * 0.1;
    this.velocity.y += cos( this.theta ) * 0.1;
    this.size *= sizeScalar;
    this.alive = this.size > 0.5;
}
Particle.prototype.show = function() {
  //arc( this.location.x, this.location.y, this.size, 0, TWO_PI );
  fill( this.color );
  noStroke();
  ellipse(this.location.x,this.location.y, this.size, this.size);
}

function spawn(x,y) {
    var particle, theta, force;
    if ( particles.length >= MAX_PARTICLES ) {
        pool.push( particles.shift() );
    }
    particle = new Particle(mouseX, mouseY, map(noise(frameCount*0.001, mouseX*0.01, mouseY*0.01), 0, 1, size1, size2));
    particle.wander = random( wander1, wander2 );
    particle.color = random( COLORS );
    particle.drag = random( drag1, drag2 );
    theta = random( TWO_PI );
    force = random( force1, force2 );
  	particle.velocity.x = sin( theta ) * force;
    particle.velocity.y = cos( theta ) * force;
    particles.push( particle );
}
function update() {
    var i, particle;
    for ( i = particles.length - 1; i >= 0; i-- ) {
        particle = particles[i];
        if ( particle.alive ) {
          particle.move();
        } else {
          pool.push( particles.splice( i, 1 )[0] );
        }
    }
}
function moved() {
    var particle, max, i;
    max = random( 1, 4 );
    for ( i = 0; i < max; i++ ) {
      spawn( mouseX, mouseY );
    }
}


// ----------------------------------------
// Runtime
// ----------------------------------------

function setup() {
	createCanvas(windowWidth, windowHeight);
	cursor("none");
	colorMode(HSB, 255);
	background(0);
}

function draw() {
	//filter(BLUR, 10);
	update();
  drawingContext.globalCompositeOperation = 'normal';
	background(0, 32);
 	//drawingContext.globalCompositeOperation = 'lighter';
	for (var i = particles.length - 1; i >= 0; i--) {
    	particles[i].show();
  }
	mouseX = random(width);
	mouseY = random(height);
	moved();
}

function mouseMoved() {
   moved();
}

function touchMoved() {
    moved();
}

function keyPressed(){
  save('pix.jpg');
}