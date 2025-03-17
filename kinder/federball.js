let importedModule;
let gameState;
let initGameState;
let runPhysics;
let playerInfo;
let debug = false;

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
    frameRate(gameState.props.frameRate);
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
        playerWidth: 64,
        playerHeight: 64,
        playerOffset: 20,
        movementSpeed: 5,
        jumpSpeed: -3,
        dashSpeed: 15,
        resistance: 0.8999,
        gravity: 0.1,
        hitForce: 1.2,
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
        playerWidth: 64,
        playerHeight: 64,
        playerOffset: 20,
        movementSpeed: 5,
        jumpSpeed: -3,
        dashSpeed: 15,
        resistance: 0.8999,
        gravity: 0.1,
        hitForce: 1.2,
        jumpCooldown: 0,
      });
    }
    gameState.game.ids[0] = 1;
    gameState.game.ids[1] = 1;
    const playerName = localStorage.getItem("playerName");
    const localHighscore = localStorage.getItem("highscore");
    if (playerName) {
      gameState.player[0].name = playerName;
    }
    if (localHighscore) gameState.game.highscore = localHighscore;
  });

  let canvas = createCanvas(960, 540);
  canvas.parent("theater");
}

function draw() {
  if (importedModule && gameState.player.length > 0) {
    level1();
  }
}
// #region DrawPlayer
function drawPlayer(player) {
  imageMode(CORNER);
  image(
    sprites[player.id % 5],
    player.posX,
    player.posY - player.playerHeight - player.playerOffset
  );
  if (debug) {
    // Draw Hitbox
    noFill();
    strokeWeight(1);
    stroke(200, 200, 0);
    rect(
      player.posX,
      player.posY - player.playerHeight - player.playerOffset,
      player.playerWidth,
      player.playerHeight
    );
    noStroke();
    fill(255);
  }

  textSize(16);
  textAlign(CENTER);
  text(
    player.name,
    player.posX + player.playerWidth / 2,
    gameState.props.height - 5
  );
}
// #endregion

function drawBall(ball) {
  fill(200);
  circle(ball.posX, ball.posY, ball.ballR * 2);
}

function drawText() {
  const lineBreak = 25;
  const offset = 35;
  fill("#E5F0F4");
  textSize(20);
  textFont("Urbanist");
  textAlign(LEFT);
  text("You need: " + gameState.levels.level1.win, 12, offset);
  textAlign(RIGHT);
  text(
    "Highscore: " + gameState.game.highscore,
    gameState.props.width - 12,
    offset
  );
  text(
    "Score: " + gameState.game.score,
    gameState.props.width - 12,
    offset + lineBreak
  );
}

function drawNextPlayerCircle() {
  let playerId = getPlayerId(gameState.player, gameState.game.nextPlayer);
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

// #region keyInput
function keyInput() {
  if (id === -1) {
    // a <-
    if (keyIsDown(65)) {
      gameState.player[0].velX = -gameState.player[0].movementSpeed;
    }
    // d ->
    if (keyIsDown(68)) {
      gameState.player[0].velX = gameState.player[0].movementSpeed;
    }
    // DASH a <-
    if (keyIsDown(65) && keyIsDown(SHIFT)) {
      gameState.player[0].velX = -gameState.player[0].dashSpeed;
    }
    // DASH d ->
    if (keyIsDown(68) && keyIsDown(SHIFT)) {
      gameState.player[0].velX = gameState.player[0].dashSpeed;
    }
    // Player2
    if (keyIsDown(LEFT_ARROW)) {
      gameState.player[1].velX = -gameState.player[1].movementSpeed;
    }
    // Player2
    if (keyIsDown(RIGHT_ARROW)) {
      gameState.player[1].velX = gameState.player[1].movementSpeed;
    }

    // DASH a <-
    if (keyIsDown(LEFT_ARROW) && keyIsDown(SHIFT)) {
      gameState.player[1].velX = -gameState.player[1].dashSpeed;
    }
    // DASH d ->
    if (keyIsDown(RIGHT_ARROW) && keyIsDown(SHIFT)) {
      gameState.player[1].velX = gameState.player[1].dashSpeed;
    }
    // r
    if (keyIsDown(82) && keyIsDown(CONTROL)) {
      gameState = initGameState();
    }
  } else {
    const playerId = getPlayerId(gameState.player, id);
    // a <-
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
      gameState.player[playerId].velX =
        -gameState.player[playerId].movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          type: "moveL",
        };
        socket.send(JSON.stringify(paket));
      }
    }
    // d ->
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
      gameState.player[playerId].velX =
        gameState.player[playerId].movementSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          type: "moveR",
        };
        socket.send(JSON.stringify(paket));
      }
    }
    //Dash a <-
    if ((keyIsDown(65) || keyIsDown(LEFT_ARROW)) && keyIsDown(SHIFT)) {
      gameState.player[playerId].velX = -gameState.player[playerId].dashSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          type: "dashL",
        };
        socket.send(JSON.stringify(paket));
      }
    }
    //Dash d ->
    if ((keyIsDown(68) || keyIsDown(RIGHT_ARROW)) && keyIsDown(SHIFT)) {
      gameState.player[playerId].velX = gameState.player[playerId].dashSpeed;
      if (socket.readyState === WebSocket.OPEN) {
        const paket = {
          type: "dashR",
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
        };
        socket.send(JSON.stringify(paket));
      }
    }
    if (mouseIsPressed) {
      if (mouseX < width / 2) {
        gameState.player[playerId].velX =
          -gameState.player[playerId].movementSpeed;
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "moveL",
          };
          socket.send(JSON.stringify(paket));
        }
      }
      // ->
      if (mouseX > width / 2) {
        gameState.player[playerId].velX =
          -gameState.player[playerId].movementSpeed;
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "moveR",
          };
          socket.send(JSON.stringify(paket));
        }
      }
    }
  }
}
// #endregion

// #region jumping
function keyPressed() {
  if (keyIsDown(20)) {
    debug = !debug;
  }
  if (id === -1) {
    if (keyCode === 87 && Date.now() - gameState.player[0].jumpCooldown > 600) {
      gameState.player[0].jumpCooldown = Date.now();
      gameState.player[0].velY = gameState.player[0].jumpSpeed;
    }
    if (
      keyCode === UP_ARROW &&
      Date.now() - gameState.player[1].jumpCooldown > 600
    ) {
      gameState.player[1].jumpCooldown = Date.now();
      gameState.player[1].velY = gameState.player[1].jumpSpeed;
    }
  } else {
    const playerId = getPlayerId(gameState.player, id);
    if (keyCode === 87 || keyCode === UP_ARROW || keyCode === 32) {
      gameState.player[playerId].velY = gameState.player[playerId].jumpSpeed;
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
