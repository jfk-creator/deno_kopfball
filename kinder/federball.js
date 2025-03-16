let importedModule;
let gameState;
let initGameState;
let runPhysics;
let playerInfo;
function setup() {
  playerInfo = document.getElementById("players");
  import("./gameState.js").then((module) => {
    importedModule = module;

    gameState = importedModule.gameState;
    initGameState = importedModule.initGameState;
    runPhysics = importedModule.runPhysics;
    frameRate(gameState.frameRate);
    const playerName = localStorage.getItem("playerName");
    const localHighscore = localStorage.getItem("highscore");
    if (playerName) {
      gameState.player[0].name = playerName;
      gameState.highscore = localHighscore;
    }
  });

  let canvas = createCanvas(960, 540);
  canvas.parent("theater");
}

function draw() {
  if (importedModule) {
    background(20);
    drawNextPlayerCircle();
    drawText();
    for (let i = 0; i < gameState.playerCount; i++) {
      let player = gameState.player[i];
      drawPlayer(player);
    }
    drawBall(gameState.ball, gameState.ballR);

    keyInput();
    gameState = importedModule.runPhysics(gameState);

    if (frameCount % 10 == 0) {
      playerInfo.innerHTML = "";
      for (let i = 0; i < gameState.playerCount; i++) {
        let player = gameState.player[i];
        playerInfo.innerHTML += `<span style="color: ${player.color}">${player.name}: ${player.ping}</span></br>`;
      }
    }
  }
}
function drawPlayer(player) {
  fill(player.color);
  rect(
    player.posX,
    player.posY - gameState.playerHeight - gameState.playerOffset,
    gameState.playerWidth,
    gameState.playerHeight
  );
  textSize(16);
  textAlign(CENTER);
  text(
    player.name,
    player.posX + gameState.playerWidth / 2,
    gameState.height - 5
  );
}

function drawBall(ball, radius) {
  fill(180);
  circle(ball.posX, ball.posY, radius * 2);
}

function drawText() {
  const lineBreak = 25;
  const offset = 35;
  fill("#E5F0F4");
  textSize(20);
  textFont("Urbanist");
  textAlign(RIGHT);
  text("Highscore: " + gameState.highscore, gameState.width - 12, offset);
  text("Score: " + gameState.score, gameState.width - 12, offset + lineBreak);
}

function drawNextPlayerCircle() {
  fill(gameState.player[gameState.nextPlayer].color);
  circle(width / 2, 50, 50);
}

// #region keyInput
function keyInput() {
  if (id === -1) {
    // a <-
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      gameState.player[0].velX = -gameState.movementSpeed;
    }
    // d ->
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      gameState.player[0].velX = gameState.movementSpeed;
    }
    // DASH a <-
    if ((keyIsDown(65) || keyIsDown(LEFT_ARROW)) && keyIsDown(SHIFT)) {
      gameState.player[0].velX = -gameState.dashSpeed;
    }
    // DASH d ->
    if ((keyIsDown(68) || keyIsDown(RIGHT_ARROW)) && keyIsDown(SHIFT)) {
      gameState.player[0].velX = gameState.dashSpeed;
    }
    // r
    if (keyIsDown(82) && keyIsDown(CONTROL)) {
      gameState = initGameState();
    }
  } else {
    // a <-
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      gameState.player[id].velX = -gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          type: "moveL",
          id: id,
        };
        socket.send(JSON.stringify(paket));
      }
    }
    // d ->
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      gameState.player[id].velX = gameState.movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          type: "moveR",
          id: id,
        };
        socket.send(JSON.stringify(paket));
      }
    }
    //Dash a <-
    if ((keyIsDown(65) || keyIsDown(LEFT_ARROW)) && keyIsDown(SHIFT)) {
      gameState.player[id].velX = -gameState.dashSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          type: "dashL",
          id: id,
        };
        socket.send(JSON.stringify(paket));
      }
    }
    //Dash d ->
    if ((keyIsDown(68) || keyIsDown(RIGHT_ARROW)) && keyIsDown(SHIFT)) {
      gameState.player[id].velX = gameState.dashSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          type: "dashR",
          id: id,
        };
        socket.send(JSON.stringify(paket));
      }
    }
    // r
    if (keyIsDown(82) && keyIsDown(CONTROL)) {
      console.log("reloading game");
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          type: "reload",
          id: id,
        };
        socket.send(JSON.stringify(paket));
      }
    }
    if (mouseIsPressed) {
      if (mouseX < width / 2) {
        gameState.player[id].velX = -gameState.movementSpeed;
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "move",
            id: id,
            velX: -5,
          };
          socket.send(JSON.stringify(paket));
        }
      }
      // ->
      if (mouseX > width / 2) {
        gameState.player[id].velX = -gameState.movementSpeed;
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "move",
            id: id,
            velX: 5,
          };
          socket.send(JSON.stringify(paket));
        }
      }
    }
  }
}
// #endregion
