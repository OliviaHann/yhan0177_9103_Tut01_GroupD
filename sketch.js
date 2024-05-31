let particles;
let img = [];
let n, s, maxR;
let indexImg = 0;
let capture;
let useWebcam = false;
let webcamButton;
let captureImg;
let countdown = 0;
let captureTime = 3;
let backButton;
let poseExample; // Add a pose example picture variable
let gravity; // Add gravity vector

// Attractor-related variables
let attractors = [];
let nParticles = 100000; // Increase particle count

function preload() {
  img.push(loadImage('assets/Edvard_Munch_The_Scream.jpeg'));
  poseExample = loadImage('assets/2.jpg'); // Preload sample pose pictures
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Always use window width and height
  background("#FFEDDA");
  smooth();

  n = 50000; // Number of particles
  s = 5; // Size of particles
  maxR = min(width, height) / 2 - min(width, height) / 20;

  particles = [];
  gravity = createVector(0, 0.1); // Initialize gravity vector

  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide();

  if (webcamButton) webcamButton.remove();
  webcamButton = createButton('Use Webcam');
  webcamButton.position(20, 20);
  webcamButton.mousePressed(startWebcamCapture);

  if (backButton) backButton.remove();
  backButton = createButton('Back to Default Image');
  backButton.position(windowWidth - 200, 20);
  backButton.mousePressed(backToDefaultImage);

  initParticles();
}

function draw() {
  background("#FFEDDA"); // Clear the background each frame
  translate(width / 2, height / 2);
  noStroke();

  if (useWebcam) {
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.show();
      p.move();
      p.applyMouseEffect(); // Apply mouse interaction effect
      if (p.isDead()) {
        particles.splice(i, 1);
        // Check if all particles are dead to capture new image
        if (particles.length == 0 && useWebcam) {
          countdown = captureTime; // Start the countdown for capturing new image
        }
      }
    }

    if (countdown > 0) {
      clear();
      fill(0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text(`Switching in ${ceil(countdown)}`, 0, -height / 2 + 40);
      textSize(24);
      text("We will capture your image, please pose as you like", 0, -height / 2 + 80);

      // Draw example pose pictures
      let imgX = -poseExample.width / 2;
      let imgY = -height / 2 + 120;
      image(poseExample, imgX, imgY);

      countdown -= deltaTime / 1000;
      if (countdown <= 0) {
        captureImg = capture.get();
        useWebcam = true;
        setup();
      }
    }
  } else {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].show();
    }

    for (let i = 0; i < attractors.length; i++) {
      attractors[i].lifeTime--;
      if (attractors[i].lifeTime <= 0) {
        attractors.splice(i, 1);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Always resize to window width and height
  maxR = min(width, height) / 2 - min(width, height) / 20;
  particles = [];
  initParticles();
  webcamButton.position(20, 20);
  backButton.position(windowWidth - 200, 20);
}

function initParticles() {
  particles = []; // Clear existing particles
  if (useWebcam) {
    for (let i = 0; i < n; i++) {
      particles.push(new Particle(maxR, s));
      let p = particles[i];
      let x, y, c;
      if (captureImg) {
        x = int(map(p.pos.x, -maxR, maxR, 0, captureImg.width));
        y = int(map(p.pos.y, -maxR, maxR, 0, captureImg.height));
        c = captureImg.get(x, y);
        p.c = applyScreamFilter(color(c), 0.5); // Apply the color filter with 0.5 alpha to webcam capture
      }
      p.target = createVector(x, y); // Initialize target
      p.vel = createVector(random(-1, 1), random(-5, 0)); // Initial random velocity
    }
  } else {
    img[0].resize(windowWidth, windowHeight); // Resize image to fit canvas
    for (let i = 0; i < nParticles; i++) {
      particles.push(new AttractedParticle());
    }
  }
}

function mousePressed() {
  if (!useWebcam) {
    attractors.push(new Attractor(mouseX - width / 2, mouseY - height / 2));
  } else {
    indexImg = (indexImg + 1) % img.length;
    setup();
  }
}

function startWebcamCapture() {
  countdown = captureTime;
  useWebcam = true;
}

function backToDefaultImage() {
  useWebcam = false;
  setup();
}

class Particle {
  constructor(maxR_, s_) {
    this.s = s_;
    this.c = "";
    this.maxR = maxR_;
    this.life = 100; // Reduce life span for quicker reset
    this.init();
  }

  init() {
    this.pos = p5.Vector.random2D();
    this.pos.normalize();
    this.pos.mult(random(2, this.maxR));
    this.vel = createVector();
    this.acc = createVector();
    this.target = createVector(0, 0); // Initialize target as a vector
  }

  show() {
    fill(this.c);
    ellipse(this.pos.x, this.pos.y, this.s, this.s);
    this.life -= 1;
  }

  move() {
    this.acc.add(gravity); // Add gravity to acceleration
    this.vel.add(this.acc); // Add acceleration to velocity
    this.pos.add(this.vel); // Add velocity to position
    this.acc.mult(0); // Reset acceleration
    if (this.pos.y > height / 2) { // If particle falls off the screen, reset it
      this.life = 0;
    }
  }

  applyMouseEffect() {
    let mouseVector = createVector(mouseX - width / 2, mouseY - height / 2);
    let d = dist(this.pos.x, this.pos.y, mouseVector.x, mouseVector.y);
    if (mouseIsPressed) {
      if (d < 100) {
        this.vel = p5.Vector.sub(mouseVector, this.pos);
        this.vel.mult(-0.01);
        this.pos.add(this.vel);
      }
    } else {
      if (d < 100) {
        this.vel = p5.Vector.sub(mouseVector, this.pos);
        this.vel.mult(0.05);
        this.pos.add(this.vel);
      }
    }
  }

  isDead() {
    return this.life < 1;
  }
}

class AttractedParticle {
  constructor() {
    this.pos = createVector(random(-width / 2, width / 2), random(-height / 2, height / 2));
    this.prevPos = this.pos.copy();
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    let imgX = int(map(this.pos.x, -width / 2, width / 2, 0, img[0].width));
    let imgY = int(map(this.pos.y, -height / 2, height / 2, 0, img[0].height));
    this.c = img[0].get(imgX, imgY); // Set particle color from image
  }

  show() {
    stroke(this.c);
    strokeWeight(4); // Increase particle size
    point(this.pos.x, this.pos.y);
  }

  move() {
    for (let attractor of attractors) {
      let force = p5.Vector.sub(attractor.pos, this.pos);
      let d = force.mag();
      d = constrain(d, 1, 25);
      let strength = 5 / (d * d);
      force.setMag(strength);
      this.acc.add(force);
    }

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  update() {
    this.prevPos = this.pos.copy();
    this.move();
  }
}

class Attractor {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.lifeTime = 255;
  }
}

function applyScreamFilter(c, alpha) {
  // Convert RGB to HSB
  let h = hue(c);
  let s = saturation(c);
  let b = brightness(c);
  
  // Adjust the hue, saturation, and brightness to match "The Scream"
  h = (h + 200) % 360; // Adjust hue towards orange and blue
  s = min(s + 20, 100); // Increase saturation
  b = max(b * 0.8, 0); // Decrease brightness

  // Adjusting color to be more orange and blue
  let newColor = color(h, s, b);
  let r = red(c) * (1 - alpha) + red(newColor) * alpha;
  let g = green(c) * (1 - alpha) + green(newColor) * alpha;
  let b_ = blue(c) * (1 - alpha) + blue(newColor) * alpha;
  
  return color(r, g, b_, 128); // Return the blended color with adjusted transparency
}
