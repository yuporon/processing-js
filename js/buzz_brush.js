let num = 3;
let ps = [];
let sc = 30;

class Particle {
  constructor(x, y, vx, vy, life, sz){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.sz = sz;
  }

  // Add random acceleration to points
  move() {
    for (let i=0; i < ps.length; i++) {
      this.pi = ps[i];
      this.pi.x += this.pi.vx;
      this.pi.y += this.pi.vy;    
      this.pi.life -= 0.02;    
      let a = 0.3 * (1 - this.pi.life);
      let b = 0.3 * (1 - this.pi.life) * min(w,h) / max(w,h);
      if (w > h) {
        this.pi.vx += random(-b, b);
        this.pi.vy += random(-a, a);
      }
      else {
        this.pi.vx += random(-a, a);
        this.pi.vy += random(-b, b);
      }
    }
  }
  
  // Display the points
  display(){
    for (let i=0; i < ps.length; i++) {
      this.pi = ps[i]; 
      let x = map(this.pi.x, -sc, sc, 0, w);
      let y = map(this.pi.y, -sc, sc, 0, h);
      this.al = map(this.pi.life, 1, 0, 255, 0);
      fill(255, 0, 255, this.al);
      ellipse(x, y, this.pi.sz, this.pi.sz);  
    }
  }
  
  // Display lines that connect points within a certain distance
  displayLine() { 
    for (let i=0; i < ps.length; i++) {
      for (let j=0; j < ps.length; j++) {
        this.pi = ps[i];
        this.pj = ps[j];
        let x1 = map(this.pi.x, -sc, sc, 0, w);
        let y1 = map(this.pi.y, -sc, sc, 0, h);
        let x2 = map(this.pj.x, -sc, sc, 0, w);
        let y2 = map(this.pj.y, -sc, sc, 0, h);
        let distance = dist(this.pi.x, this.pi.y, this.pj.x, this.pj.y);
        if(distance < 7*(1 - this.pi.life)) {
          if(0.8>random(1)) {
            push();
            this.col = map(distance, 0, 10, 255, 0);
            stroke(255 * 2 * this.pi.life, this.col, 255 - this.col, this.col);
            noFill();
            line(x1, y1, x2, y2);
            pop();
          }
        }
      }
    }
  }
  
  // Delete the points that have reached the end of their life
  delete() {
  　for (i = ps.length - 1; i >= 0; i--) {
    　this.pi = ps[i];
   　 if (this.pi.life <= 0) {
    　  ps.splice(i,1);
    　}
  　}
  }
}

function setup() {
  createCanvas(w=windowWidth, h=windowHeight);
  for (i = 0; i < num; i++) {
    p = new Particle(0, 0, 0, 0, 0, 0);
    append(ps, p);
  } 
}

function draw() {
  background(0);
  p.move();
  p.display();
  p.displayLine();
  p.delete();
}

function mouseDragged() {
  for (i = 0; i < 2; i++) {
    let mx =  map(mouseX, 0, w, -sc, sc);
    let my =  map(mouseY, 0, h, -sc, sc);
    p = new Particle(mx + random(-0.1, 0.1), my + random(-0.1, 0.1), 0, 0, 1, random(1, 5));
    append(ps, p);
  }
}

function mouseClicked() {
  for (i = 0; i < 20; i++) {
    let mx =  map(mouseX, 0, w, -sc, sc);
    let my =  map(mouseY, 0, h, -sc, sc);
    p = new Particle(mx + random(-1, 1), my + random(-1, 1), 0, 0, random(0.5, 1.5), random(1, 5));
    append(ps, p);
  }
}