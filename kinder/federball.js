function setup() {
  let canvas = createCanvas(960, 540);
  canvas.parent('theater');
  frameRate(60)
}

function draw() {
      document.getElementById("hits").innerText = gameState.hits;
  background(20);  
  drawPlayer(gameState.player1, gameState.p1_custom.color)
  drawPlayer(gameState.player2, gameState.p2_custom.color);
  drawBall(gameState.ball, gameState.ballR);

  runPhysics()
  console.log("runPhysics")
  keyInput()
}

function drawPlayer({ posX, posY}, color){
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
      gameState.player1.velX -= gameState.movementSpeed;
    }
    // d ->
    if (keyIsDown(68)) {
      gameState.player1.velX += gameState.movementSpeed;
    }
    if (keyIsDown(LEFT_ARROW)) {
      gameState.player2.velX -= gameState.movementSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      gameState.player2.velX += gameState.movementSpeed;
    }
    if (keyIsDown(82)) initGameState()
  }
  if(id === 1){
      // a <-
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      gameState.player1.velX -= gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        id: id,
        velX: gameState.player1.velX,
      };
      socket.send(JSON.stringify(paket));
    }
    }
    // d ->
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      gameState.player1.velX += gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          id: id,
          velX: gameState.player1.velX,
        };
        socket.send(JSON.stringify(paket));
      }
    }
  }
  if (id === 2) {
    // a <-
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      gameState.player2.velX -= gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          id: id,
          velX: gameState.player2.velX,
        };
        socket.send(JSON.stringify(paket));
      }
    }
    // d ->d
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      gameState.player2.velX += gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          id: id,
          velX: gameState.player2.velX,
        };
        socket.send(JSON.stringify(paket));
      }
    }
  }
}
