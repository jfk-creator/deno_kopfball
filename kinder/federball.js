function setup() {
  let canvas = createCanvas(960, 540);
  canvas.parent('theater');
  frameRate(60)
}

function draw() {
  background(20);  
  drawPlayer(gameState.player1, gameState.p1_custom.color)
  drawPlayer(gameState.player2, gameState.p2_custom.color);
  drawBall(gameState.ball);


  runPhysics()
  keyInput()
}

function drawPlayer({ posX, posY}, color){
  fill(color);
  rect(posX, posY-100, 50, 100);
}

function drawBall({ posX, posY}){
  fill(180)
  circle(posX, posY, 10)
}

function keyInput() {
  if (id === -1) {
    // a <-
    if (keyIsDown(65)) {
      gameState.player1.velX = -5;
      
    }
    // d ->
    if (keyIsDown(68)) {
      gameState.player1.velX = 5;
      
    }
  }
  if(id === 1){
      // a <-
    if (keyIsDown(65) ) {
      gameState.player1.velX = -5
      if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        id: id,
        velX: gameState.player1.velX,
      };
      socket.send(JSON.stringify(paket));
    }
    }
    // d ->
    if (keyIsDown(68) ) {
      gameState.player1.velX = 5;
      if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        id: id,
        velX: gameState.player1.velX,
      };
      socket.send(JSON.stringify(paket));
    };
    }
  }
  if (id === 2) {
    // a <-
    if (keyIsDown(65) ) {
      gameState.player2.velX = -5;
      if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        id: id,
        velX: gameState.player2.velX,
      };
      socket.send(JSON.stringify(paket));
    };
    }
    // d ->d
    if (keyIsDown(68)) {
      gameState.player2.velX = 5;
      if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        id: id,
        velX: gameState.player2.velX,
      };
      socket.send(JSON.stringify(paket));
    };
    }
  }
}
