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
}

function drawPlayer({ posX, posY}, color){
  fill(color);
  rect(posX, posY-100, 50, 100);
}

