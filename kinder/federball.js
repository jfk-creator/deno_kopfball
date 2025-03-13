
function setup() {
  let canvas = createCanvas(960, 540);
  canvas.parent('theater');
  frameRate(60)
}

function draw() {
  document.getElementById("hits").innerText = gameState.hits;
  background(20);  
  text("Hits: " + gameState.hits, 10, 20);
  text("Highscore: " + gameState.highscore, 10, 35);
  drawPlayer(gameState.player1, gameState.p1_custom.color);
  drawPlayer(gameState.player2, gameState.p2_custom.color);
  drawPlayer(gameState.player3, gameState.p3_custom.color);
  drawPlayer(gameState.player4, gameState.p4_custom.color);
  drawBall(gameState.ball, gameState.ballR);

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
      gameState.player1.velX = -gameState.movementSpeed;
    }
    // d ->
    if (keyIsDown(68)) {
      gameState.player1.velX = gameState.movementSpeed;
    }
    if (keyIsDown(LEFT_ARROW)) {
      gameState.player2.velX = -gameState.movementSpeed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      gameState.player2.velX = gameState.movementSpeed;
    }
    if (keyIsDown(82)) initGameState()
  }
  if(id === 1){
      // a <-
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      gameState.player1.velX = -gameState.movementSpeed;
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
      gameState.player1.velX = +gameState.movementSpeed;
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
      gameState.player2.velX = -gameState.movementSpeed;
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
      gameState.player2.velX = +gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          id: id,
          velX: gameState.player2.velX,
        };
        socket.send(JSON.stringify(paket));
      }
    }
  }
  if (id === 3) {
    // a <-
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      gameState.player3.velX = -gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          id: id,
          velX: gameState.player3.velX,
        };
        socket.send(JSON.stringify(paket));
      }
    }
    // d ->d
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      gameState.player3.velX = +gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          id: id,
          velX: gameState.player3.velX,
        };
        socket.send(JSON.stringify(paket));
      }
    }
  }
  if (id === 4) {
    // a <-
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      gameState.player4.velX = -gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          id: id,
          velX: gameState.player4.velX,
        };
        socket.send(JSON.stringify(paket));
      }
    }
    // d ->d
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      gameState.player4.velX = +gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          id: id,
          velX: gameState.player4.velX,
        };
        socket.send(JSON.stringify(paket));
      }
    }
  }
}
