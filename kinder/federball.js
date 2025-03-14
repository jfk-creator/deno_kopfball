let importedModule
let gameState
let initGameState
let runPhysics

function setup() {
  import("./gameState.js")
  .then((module) => {
    importedModule = module;

        gameState = importedModule.gameState
        initGameState = importedModule.initGameState
        runPhysics = importedModule.runPhysics
        frameRate(gameState.frameRate)
  });
  
  let canvas = createCanvas(960, 540);
  canvas.parent('theater');
}

function draw() {
  if(gameState.player){
    background(20);  
    fill(gameState.player[gameState.nextPlayer%gameState.player.length].color)
    circle(width/2, 50, 50);
    text("Hits: " + gameState.hits, 10, 20);
    text("Highscore: " + gameState.highscore, 10, 35);
    for (let i = 0; i < gameState.playerCount; i++) {
      let player = gameState.player[i];
      drawPlayer(player)
    }
    drawBall(gameState.ball, gameState.ballR);
    keyInput()
    gameState = importedModule.runPhysics(gameState)
  }
}


function drawPlayer({ posX, posY, color}){
  fill(color);
  rect(posX, posY-100, 50, 100);
}

function drawBall(ball, radius){
  fill(180)
  circle(ball.posX, ball.posY, radius*2)
}

function keyInput() {
  if (id === -1) {
    // a <-
    if (keyIsDown(65)) {
      gameState.player[0].velX = -gameState.movementSpeed;
    }
    // d ->
    if (keyIsDown(68)) {
      gameState.player[0].velX = gameState.movementSpeed;
    }
    if (keyIsDown(LEFT_ARROW)) {
      gameState.player[1].velX = -gameState.movementSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      gameState.player[1].velX = gameState.movementSpeed;
    }
    // r
    if (keyIsDown(82)) {
      gameState = initGameState()
    }
  } else {
    // a <-
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      gameState.player[id].velX = -gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          id: id,
          velX: -5,
        };
        socket.send(JSON.stringify(paket));
      }
    }
    // a <-
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      gameState.player[id].velX = -gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          id: id,
          velX: 5,
        };
        socket.send(JSON.stringify(paket));
      }
    }
  }
}
