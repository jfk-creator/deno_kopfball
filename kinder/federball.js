let importedModule;
let gameState;
let initGameState;
let runPhysics;
let playerInfo;

function preload() {
  sprites = [
    loadImage("./assets/chonki_yellow.png"),
    loadImage("./assets/chonki_orange.png"),
    loadImage("./assets/chonki_blue.png"),
    loadImage("./assets/chonki_green.png"),
    loadImage("./assets/chonki_red.png"),
  ];
  ballSprite = loadImage("./assets/balli.png");
}

function setup() {
  playerInfo = document.getElementById("players");
  import("./gameState.js").then((module) => {
    importedModule = module;

    gameState = importedModule.gameState;
    initGameState = importedModule.initGameState;
    runPhysics = importedModule.runPhysics;
    frameRate(gameState.frameRate);
    gameState.player = [];
    if (!connectionInitialized) {
      gameState.player.push({
        posX: 480,
        posY: 540,
        velX: Math.random() * 50 - 25,
        velY: 0,
        id: 0,
        ping: 0,
        name: "Hans",
        color: "#FFA905",
        jumpCooldown: 0,
      });
      gameState.player.push({
        posX: 480,
        posY: 540,
        velX: Math.random() * 50 - 25,
        velY: 0,
        id: 1,
        ping: 0,
        name: "Laura",
        color: "#FF5400",
        jumpCooldown: 0,
      });
    }
    gameState.ids[0] = 1;
    gameState.ids[1] = 1;
    const playerName = localStorage.getItem("playerName");
    const localHighscore = localStorage.getItem("highscore");
    if (playerName) {
      gameState.player[0].name = playerName;
    }
    if (localHighscore) gameState.highscore = localHighscore;
  });

  let canvas = createCanvas(960, 540);
  canvas.parent("theater");
}

function draw() {
  if (importedModule && gameState.player.length > 0) {
    background(20);
    drawNextPlayerCircle();
    drawText();
    for (let i = 0, k = 0; i < gameState.ids.length; i++) {
      if (gameState.ids[i] === 1) {
        let player = gameState.player[k++];
        drawPlayer(player);
      }
    }
    drawBall(gameState.ball, gameState.ballR);

    keyInput();
    gameState = importedModule.runPhysics(gameState);

    if (frameCount % 10 == 0) {
      playerInfo.innerHTML = "";
      for (let i = 0; i < gameState.player.length; i++) {
        let player = gameState.player[i];
        playerInfo.innerHTML += `<span style="color: ${player.color}">${player.id}. ${player.name}: ${player.ping}</span></br>`;
      }
    }
  }
}
// #region DrawPlayer
function drawPlayer(player) {
  image(
    sprites[player.id % 5],
    player.posX,
    player.posY - gameState.playerHeight - gameState.playerOffset
  );

  textSize(16);
  textAlign(CENTER);
  text(
    player.name,
    player.posX + gameState.playerWidth / 2,
    gameState.height - 5
  );
}
// #endregion

function drawBall(ball, radius) {
  fill(200);
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
  let playerId = getPlayerId(gameState.player, gameState.nextPlayer);
  if (playerId === -1) {
    console.error("drawCircle, couln't find player");
  }
  fill(gameState.player[playerId].color);
  circle(width / 2, 50, 50);
}

function getPlayerId(players, key) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === key) {
      // console.log(`found id: ${players[i].id} as: ${i}`);
      return i;
    }
  }
  return -1;
}

function getNextPlayerId(players, key) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === key) {
      if (i < players.length - 1) return players[i + 1].id;
      else return players[0].id;
    }
  }
}

function saId() {
  for (let i = 0; i < gameState.ids.length; i++) {
    if (gameState.ids[i] === 0) {
      return i;
    }
  }
  return -1;
}

// #region keyInput
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
    // DASH a <-
    if (keyIsDown(65) && keyIsDown(SHIFT)) {
      gameState.player[0].velX = -gameState.dashSpeed;
    }
    // DASH d ->
    if (keyIsDown(68) && keyIsDown(SHIFT)) {
      gameState.player[0].velX = gameState.dashSpeed;
    }
    // Player2
    if (keyIsDown(LEFT_ARROW)) {
      gameState.player[1].velX = -gameState.movementSpeed;
    }
    // Player2
    if (keyIsDown(RIGHT_ARROW)) {
      gameState.player[1].velX = gameState.movementSpeed;
    }

    // DASH a <-
    if (keyIsDown(LEFT_ARROW) && keyIsDown(SHIFT)) {
      gameState.player[1].velX = -gameState.dashSpeed;
    }
    // DASH d ->
    if (keyIsDown(RIGHT_ARROW) && keyIsDown(SHIFT)) {
      gameState.player[1].velX = gameState.dashSpeed;
    }
    // r
    if (keyIsDown(82) && keyIsDown(CONTROL)) {
      gameState = initGameState();
    }
  } else {
    const playerId = getPlayerId(gameState.player, id);
    // a <-
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      gameState.player[playerId].velX = -gameState.movementSpeed;
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
      gameState.player[playerId].velX = gameState.movementSpeed;
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
      gameState.player[playerId].velX = -gameState.dashSpeed;
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
      gameState.player[playerId].velX = gameState.dashSpeed;
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
        gameState.player[playerId].velX = -gameState.movementSpeed;
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "moveL",
            id: id,
          };
          socket.send(JSON.stringify(paket));
        }
      }
      // ->
      if (mouseX > width / 2) {
        gameState.player[playerId].velX = -gameState.movementSpeed;
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "moveR",
            id: id,
          };
          socket.send(JSON.stringify(paket));
        }
      }
    }
  }
}
// #endregion

function keyPressed() {
  if (id === -1) {
    if (keyCode === 87 && Date.now() - gameState.player[0].jumpCooldown > 600) {
      gameState.player[0].jumpCooldown = Date.now();
      gameState.player[0].velY = gameState.jumpSpeed;
    }
    if (
      keyCode === UP_ARROW &&
      Date.now() - gameState.player[1].jumpCooldown > 600
    ) {
      gameState.player[1].jumpCooldown = Date.now();
      gameState.player[1].velY = gameState.jumpSpeed;
    }
  } else {
    if (keyCode === 87 || keyCode === UP_ARROW) {
      gameState.player[0].velY = gameState.jumpSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          type: "jump",
          id: id,
        };
        socket.send(JSON.stringify(paket));
      }
    }
  }
}
