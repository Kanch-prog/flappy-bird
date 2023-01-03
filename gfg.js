//scale of bird/canvas
var scl = 50;

//bird caller
var bird;
var pillars = [];


function setup() {
  createCanvas(800, 400);
  bird = new Bird();
  pillars.push(new Pillars());
  
}

// audio files
var fly = new Audio();
var scor = new Audio();

fly.src = "bounce.mp3";
scor.src = "sounds/score.mp3";

//gravity

let time = 0;
let velocity;
const g = 0.4;

function gravity() {
  time += 1;

  velocity = Math.pow(g, 2) * time;

  bird.y += velocity;
}

//start game

var start = false;


function gameStart() {
  if (start === false) {
    let clickStart = "click to fly";
    fill(255, 255, 255);
    textSize(50);
    text(clickStart,250, height / 2 + 150, 700, 250);

    bird.y = bird.startingLoc;
    pillars = [];
    scoreTimer = 0;
    fly.play();
    
  } else {

  }
}

//score
var scoreTimer = 0;

var scoreTimerStart = false;

function score() {
  if (scoreTimerStart == true) {
    scoreTimer++;
  } else {
  }
  var scoreTest = "Score: " + String(scoreTimer);
  fill(255, 255, 255);
  textSize(25);
  text(scoreTest, 10, 10, 700, 250);
}

//bird construnctor
function Bird() {
  this.startingLoc = 250;

  this.x = this.startingLoc;
  this.y = this.startingLoc;

  this.show = function () {
    fill(255,0,0);
    rect(this.x, this.y, scl, scl);
  };

  //death
  this.death = function () {
    if (this.y >= 400) {
      death();
    }
  };
}

//Pillars

function Pillars() {
  this.spacing = 100;
  this.top = random(height / 6, (3 / 4) * height);
  this.bottom = height - (this.top + this.spacing);
  this.x = width;
  this.w = 50;
  this.speed = 6;

  this.highlight = false;

  this.hits = function (bird) {
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        this.highlight = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  };

  this.show = function () {
    fill(43, 224, 122);
    if (this.highlight) {
      fill(255, 0, 0);
    }
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  };

  this.update = function () {
    this.x -= this.speed;
  };

  this.offscreen = function () {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  };
}

//trigger when dead

var dead = false;

function death() {
  dead = true;
  noLoop();
  fly.stop();
}

//controls and restart on mouse click

function mouseClicked() {
  var image = document.getElementById("titleScreen");
  start = true;
  scoreTimerStart = true;
  //flying
  bird.y += -50;
  time = 0;
  image.style.display = "none";
  //restarting
  if (dead === true) {
    time = 0;
    scoreTimer = 0;
    bird.y = 250;
    pillars = [];
    dead = false;
    loop();
  }
}

function draw() {
  background(0,170,35);

  //pillars

  for (var i = pillars.length - 1; i >= 0; i--) {
    pillars[i].show();
    pillars[i].update();

    if (pillars[i].hits(bird)) {
      death();
    }

    if (pillars[i].offscreen()) {
      pillars.splice(i, 1);
    }
  }

  if (frameCount % 75 == 0) {
    pillars.push(new Pillars());
  }
  //bird and gravity
  bird.show();
  gravity();
  bird.death();

  //Game over screen

  if (dead === true) {
    scoreTimerStart = false;
    fill(0, 71, 70, 200);
    rect(-1, -1, width + 1, height + 1);

    let gameOver = "Game Over";
    fill(178, 46, 0);
    textSize(70);
    text(gameOver, width / 3 - 50, height / 3 + 50, 700, 250);

    let clickRestart = "click to restart";
    fill(178, 214, 129);
    textSize(40);
    text(clickRestart, 250, height / 3 + 100, 700, 250);
  }
  gameStart();
  score();
}
