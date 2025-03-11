let p1;
let p2;

let vel1;
let vel2;

let ball;
let ball_vel;

let racketTick_p1 = 0;
let racketTick_p2 = 0;

let hitbox1;
let hitbox2;

let aufschlag_p1 = true;
let aufschlag = true;

const friction = 1.125;
const playerWidth = 50;
let ball_height;

let counter = 1;

let gameOver = false;

function setup() {
  let canvas = createCanvas(960, 540);
  canvas.parent('theater');
  p1 = createVector(0, height);
  p2 = createVector(width - 50, height);
  vel1 = createVector(0, 0);
  vel2 = createVector(0, 0);
  ball = createVector(width / 2, height / 2);
  ball_vel = createVector(0, -2);
  ball_height = height - 135;
}

function draw() {
  hitbox1 = createVector(p1.x - 40, p1.y - 65 - 45);
  hitbox2 = createVector(p2.x + 50, p2.y - 65 - 45);

  if (racketTick_p1 < 15) racketTick_p1++;
  if (racketTick_p2 < 15) racketTick_p2++;
  keyInput();
  movePlayers();
//   moveBall();
  bodysCollide();
  background(15);
  drawPlayer(p1, 1);
  drawPlayer(p2, 2);
  drawRacket(p1, 1);
  drawRacket(p2, 2);
  drawBall();
  hitBall();

  if (gameOver) {
    // fill(180); // Set the text color to black
    // textSize(32); // Set the text size
    // textAlign(CENTER, CENTER); // Center alignment
    // text("Game Over", width/2, 50)
    // noLoop()
    ball.x = width / 2;
    ball.y = height / 2;
    ball_vel.x = 0;
    ball_vel.y = -2;
    gameOver = !gameOver;
    aufschlag = true;
    counter = 1;
  }
}

function movePlayers() {
  p1.x += vel1.x;
  p2.x += vel2.x;

  vel1.x /= friction;
  vel2.x /= friction;

  // check bounds
  if (p1.x > width - playerWidth) vel1.x -= 10;
  if (p1.x < 0) vel1.x += 10;

  if (p2.x > width - playerWidth) vel2.x -= 10;
  if (p2.x < 0) vel2.x += 10;
}

function drawBall() {
  fill(200);
  circle(ball.x, ball.y, 10 * counter);
}

// function moveBall() {
//   if (ball.y > height) gameOver = true;
//   const friction = 1.003;
//   const gravity = 0.01;
//   ball.x += ball_vel.x;
//   ball.y += ball_vel.y;

//   ball_vel.x /= friction;
//   ball_vel.y += gravity;

//   if (ball.x > width - 5) ball_vel.x *= -1;
//   if (ball.x < 0 + 5) ball_vel.x *= -1;
// }

let frames = 0;
function hitBall() {
  let hitForce_X = 2;
  let hitForce_Y = 2;

  if (frameCount - frames > 5) {
    if (dist(ball.x, ball.y, hitbox1.x, hitbox1.y) < 15) {
      hitForce_X = ((racketTick_p1 + 5) * counter) / 4;
      ball_vel.x = hitForce_X;
      ball_vel.y = -hitForce_Y;
      counter++;
      console.log(counter);
      frames = frameCount;
    }

    if (dist(ball.x, ball.y, hitbox2.x, hitbox2.y) < 15) {
      hitForce_X = ((racketTick_p2 + 5) * counter) / 4;
      ball_vel.x = -hitForce_X;
      ball_vel.y = -hitForce_Y;
      counter++;
      console.log(counter);
      frames = frameCount;
    }
  }
}

function drawPlayer(p, id) {
  if (id == 1) {
    fill(255, 153, 0); //orange
    drawRacketHitbox(p, id);
    fill(255, 153, 0); //orange
  } else {
    fill(0, 102, 255); //blue
    drawRacketHitbox(p, id);
    fill(0, 102, 255); //blue
  }
  rect(p.x, p.y - 100, playerWidth, 100); // x,y,width,heigth
}

function drawRacket(p, id) {
  push();
  if (id == 1) {
    fill(255, 153, 0); //orange
  } else {
    fill(0, 102, 255); //blue
  }

  translate(p.x + playerWidth / 2, p.y - 65);
  if (id == 1) rotate(radians(-225));
  if (id == 1 && racketTick_p1 < 15) {
    rotate(racketTick_p1 / 8);
  }
  if (id == 2) rotate(radians(225));
  if (id == 2 && racketTick_p2 < 15) {
    rotate(-racketTick_p2 / 8);
  }
  rect(0, 0, playerWidth / 3, 75);
  pop();
  if (id == 1) {
    // drawRacketHitbox(p, id)
    // stroke(255)
    // line(ball.x, ball.y, hitbox1.x, hitbox1.y)
  }
  if (id == 2) {
    // drawRacketHitbox(p, id)
    // stroke(255)
    // line(ball.x, ball.y, hitbox2.x, hitbox2.y)
  }
}

function drawRacketHitbox(p, id) {
  // stroke(255,0,0)
  let point1 = createVector(p.x + playerWidth / 2, p.y - 65);
  let point2 = createVector(p.x + playerWidth / 2, p.y - 65 - 65);
  let fi = 0;
  if (id == 1 && racketTick_p1 < 15) {
    fill(0, 102, 255);
    fi = 18.105 + racketTick_p1 / 8;
    point2.x = point1.x + -Math.sin(fi) * (point2.y - point1.y);
    point2.y = point1.y + Math.cos(fi) * (point2.y - point1.y);
    line(point1.x, point1.y, point2.x, point2.y);
    circle(point2.x - 1, point2.y, 30);
    hitbox1 = point2;
  }
  if (id == 2 && racketTick_p2 < 15) {
    fill(255, 153, 0);
    fi = -18.105 - racketTick_p2 / 8;
    point2.x = point1.x + -Math.sin(fi) * (point2.y - point1.y);
    point2.y = point1.y + Math.cos(fi) * (point2.y - point1.y);
    line(point1.x, point1.y, point2.x, point2.y);
    circle(point2.x - 1, point2.y, 30);
    hitbox2 = point2;
  }
}

function keyPressed() {
  const ball_force = 2;
  if (key == "w") {
    racketTick_p1 = 0;

    if (aufschlag && aufschlag_p1) {
      ball.x = p1.x;
      ball.y = height - 150;
      ball_vel.x = ball_force;
      ball_vel.y = -ball_force;
      aufschlag_p1 = !aufschlag_p1;
      aufschlag = !aufschlag;
    }
  }
  if (keyCode == UP_ARROW) {
    racketTick_p2 = 0;
    if (aufschlag && !aufschlag_p1) {
      ball.x = p2.x;
      ball.y = height - 150;
      ball_vel.x = -ball_force;
      ball_vel.y = -ball_force;
      aufschlag_p1 = !aufschlag_p1;
      aufschlag = !aufschlag;
    }
  }
}

let countDown = 0;

function bodysCollide() {
  const pushForce = 7;
  const offset = 5;
  if (p1.x + playerWidth > p2.x - offset) {
    vel1.x -= pushForce;
    vel2.x += pushForce;
    countDown = 10;
    return true;
  }
  if (countDown > 0) {
    countDown--;
    return true;
  }
}
function keyInput() {
  const offset = 25;
  if (keyIsDown(65) && p1.x > offset) {
    // a <-
    vel1.x = -5;
  }
  if (keyIsDown(68) && p1.x < width - playerWidth - offset && !bodysCollide()) {
    // d ->
    vel1.x = 5;
  }
  if (keyIsDown(LEFT_ARROW) && p2.x > offset && !bodysCollide()) {
    vel2.x = -5;
  }
  if (keyIsDown(RIGHT_ARROW) && p2.x < width - playerWidth - offset) {
    vel2.x = 5;
  }
  if (keyIsDown(32)){
    sendData()
  }

  if (keyCode === ENTER) {
    // Code to run.
  }
}
