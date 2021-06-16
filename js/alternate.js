let points = [];

let r = 100;
let u = 53;
let v = 53;

let x;
let y;
let z;

let a;
let f;

let c = 0;
let s;
let variation = 0;

function setup() {
  createCanvas(w=windowWidth, h=windowHeight, WEBGL);
  colorMode(HSB,360,100,100);
  background(0);
}

function draw() {
  background(0);
  c++;
  rotateX(c * 0.01);
  rotateY(c * 0.01);
  
  for(i=0;i<u;i++) {
    for(j=0;j<v;j++) {
      let theta = i * TWO_PI / u;
      let phi = j * TWO_PI / v;
      x = r * cos(theta) * cos(phi)
      y = r * cos(theta) * sin(phi)
      z = r * sin(theta)    
      let pv = createVector(x, y, z);
      
      a = 1.0 + 4.0 * (1 - mouseY / height);
      f = 0.8 * mouseX / width;
      
      if(a==0 || f==0){
        s = 1;
      }
      else{
       s = getVariation();
      }
      let pvs = pv.mult(s);
      append(points, pvs);
 
      let bl = map(s, 0, a, 0, 360)
      stroke(bl, 100, 100);
      point(pvs.x, pvs.y, pvs.z);
    }
  }
}

function getVariation(){
  switch(variation){
	case 0:return a * sin( z *  f / PI);
    case 1:return a * cos( 0.5 * z *  f / PI);
	case 2:return a * sin( x *  f / PI);
    case 3:return a * cos( 0.5 * x *  f / PI);
    case 4:return a * cos( 0.2 * x *  f / PI) * cos(0.2 * y *  f / PI);
	case 5:return a * cos( 0.2 * x *  f / PI) * cos(0.2 * y *  f / PI) * cos(0.2 * z *  f / PI);
	case 6:return a * cos( 0.0001 * x * y * z * f / PI);
    case 7:return a * cos( 0.2 * x *  f / PI) * cos(0.2 * y *  f / PI) * sin(0.2 * z *  f / PI);
  }
}

function mouseClicked(){
  variation++;
  if(variation>7){
    variation = 0;
  }
}