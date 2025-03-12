function setup() {
  let canvas = createCanvas(960, 540);
  canvas.parent('theater');
  frameRate(60)
}

function draw() {
  background(20);  
  drawPlayer(gameState.player1, gameState.p1_custom.color)
  drawPlayer(gameState.player2, gameState.p2_custom.color);


  runPhysics()
  keyInput()
}

function drawPlayer({ posX, posY}, color){
  fill(color);
  rect(posX, posY-100, 50, 100);
}

function keyInput() {
    // a <-
  if (keyIsDown(65)) {
    gameState.player1.velX = -5
    socket.send(JSON.stringify(gameState))
  }
  // d ->
  if (keyIsDown(68)) {
    gameState.player1.velX = 5;
    socket.send(JSON.stringify(gameState));
  }
}
