let bg;
const COL = createCols("https://coolors.co/app/f1e7b6-400082-fe346e-f3c623-06aed5");

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	bg = createGraphics(width, height);
	bg.background(255,20);
  bg.noStroke();
  for (let i = 0; i < 300000; i++) {
    let x = random(width);
    let y = random(height);
    let s = noise(x*0.01, y*0.01)*2;
    bg.fill(240, 50);
    bg.rect(x, y, s, s);
  } 
}

function draw() {
	randomSeed(0);
	noStroke();
	for(let i = 0; i < 25; i++){
		fill(COL[int(random(COL.length))]);
		let s = random(20,40)* (random(1,2)+(sin(frameCount/100+random(100))+1)*0.5);
		let x = (random(width)+frameCount*random(1,10))%(width+s)-s;
		let y = (random(height)+sin(frameCount/100)*height*random(0.2,1) + height)%(height+s)-s;
		ellipse(x,y, s, s);
	}
	image(bg,0,0);
}

function createCols(_url)
{
  let slash_index = _url.lastIndexOf('/');
  let pallate_str = _url.slice(slash_index + 1);
  let arr = pallate_str.split('-');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = '#' + arr[i];
  }
  return arr;
}