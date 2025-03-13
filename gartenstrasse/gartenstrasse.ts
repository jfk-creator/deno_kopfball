const sockets = new Set<WebSocket>();
let maxConnection = 400
let socketCounter = 1;
let gamestarted = false

Deno.serve({ port: 420 }, (request) => {
  if (request.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  if (sockets.size >= maxConnection) {
    console.error(
      "Server full"
    );
    return new Response("Server full.", { status: 429});
  }
  const { socket, response } = Deno.upgradeWebSocket(request);
  handleSocket(socket);
  return response;
});

function handleSocket(socket: WebSocket) {
  sockets.add(socket);
  
  socket.onopen = () => {
    console.log(`we found player${socketCounter}`);
    const paket = {
      id: socketCounter++,
      gs: gameState
    }
    socket.send(JSON.stringify(paket))
  };

  socket.onmessage = (event) => {
    const paket = JSON.parse(event.data);
    console.log("Received message: ", paket)
    if(paket.id == 1) gameState.player1.velX = paket.velX
    if(paket.id == 2) gameState.player2.velX = paket.velX
    if(paket.id == 3) gameState.player3.velX = paket.velX;
    if(paket.id == 4) gameState.player4.velX = paket.velX;

  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    sockets.delete(socket);
    socketCounter--;
    initGameState()
  };

  socket.onerror = (error) => {
    console.error("WebSocket error: ", error);
    sockets.delete(socket);
  };
}

function broadcast() {
  for (const socket of sockets) {
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        id: socketCounter,
        gs: gameState,
      };
      socket.send(JSON.stringify(paket));
    }
  }
}
// gamestate

let gameState = {
  frameRate: 90,
  width: 960,
  height: 540,
  playerWidth: 50,
  movementSpeed: 5,
  resistance: 0.899,
  hitForce: 1.5,
  gravity: 0.25,
  airDrag: 0.995,
  ballR: 5,
  tick: 0,
  hits: 0,
  highscore: 0,
  player1: {
    posX: 20,
    posY: 540,
    velX: 1,
    velY: 0,
  },
  p1_custom: {
    color: "#EFB662", //gold
  },
  player2: {
    posX: 20 + 120,
    posY: 540,
    velX: 1,
    velY: 0,
  },
  p2_custom: {
    color: "#7DCFFF", //lightBlue
  },
  player3: {
    posX: 20 + 240,
    posY: 540,
    velX: -1,
    velY: 0,
  },
  p3_custom: {
    color: "#9ECE6A", //Green
  },
  player4: {
    posX: 20 + 360,
    posY: 540,
    velX: -1,
    velY: 0,
  },
  p4_custom: {
    color: "#FF757F", //Red
  },
  ball: {
    posX: 70,
    posY: 540 / 2,
    velX: 2,
    velY: -2,
  },
};

function initGameState() {
  gameState = {
    frameRate: 90,
    width: 960,
    height: 540,
    playerWidth: 50,
    movementSpeed: 5,
    resistance: 0.899,
    hitForce: 1.5,
    gravity: 0.25,
    airDrag: 0.995,
    ballR: 5,
    tick: 0,
    hits: 0,
    highscore: 0,
    player1: {
      posX: 20,
      posY: 540,
      velX: 1,
      velY: 0,
    },
    p1_custom: {
      color: "#EFB662", //gold
    },
    player2: {
      posX: 20 + 120,
      posY: 540,
      velX: 1,
      velY: 0,
    },
    p2_custom: {
      color: "#7DCFFF", //lightBlue
    },
    player3: {
      posX: 20 + 240,
      posY: 540,
      velX: -1,
      velY: 0,
    },
    p3_custom: {
      color: "#9ECE6A", //Green
    },
    player4: {
      posX: 20 + 360,
      posY: 540,
      velX: -1,
      velY: 0,
    },
    p4_custom: {
      color: "#FF757F", //Red
    },
    ball: {
      posX: 70,
      posY: 540 / 2,
      velX: 2,
      velY: -2,
    },
  };
}

async function runPhysics() {
  //player1
  gameState.player1 = move(gameState.player1);
  gameState.player1 = resistance(gameState.player1);
  //player2
  gameState.player2 = move(gameState.player2);
  gameState.player2 = resistance(gameState.player2);
  //player3
  gameState.player3 = move(gameState.player3);
  gameState.player3 = resistance(gameState.player3);
  //player4
  gameState.player4 = move(gameState.player4);
  gameState.player4 = resistance(gameState.player4);
  //ball
  gameState.ball = move(gameState.ball);
  gameState.ball = ballPhysics(gameState.ball);
  //CheckBounds for all objects:
  checkBounds();
  kopfball(gameState.player1, gameState.ball);
  kopfball(gameState.player2, gameState.ball);
  kopfball(gameState.player3, gameState.ball);
  kopfball(gameState.player4, gameState.ball);
}

interface vec4 {
  posX: number,
  posY: number,
  velX: number,
  velY: number
}

function move({ posX, posY, velX, velY }: vec4) {
  posX += velX;
  posY += velY;

  return { posX, posY, velX, velY };
}

function ballPhysics({ posX, posY, velX, velY }: vec4) {
  velY += gameState.gravity;
  velY *= gameState.airDrag;
  velX *= gameState.airDrag;
  if (Math.abs(velY) < 0.001 && posY > gameState.height - 30) initGameState();
  const factor = Math.pow(10, 10);
  velY = Math.floor(velY * factor) / factor;
  return { posX, posY, velX, velY };
}

function resistance(player: vec4) {
  player.velX *= gameState.resistance;
  const factor = Math.pow(10, 10);
  player.velY = Math.floor(player.velY * factor) / factor;
  return player;
}

function kopfball(player: vec4, ball: vec4) {
  if (
    ball.posX - player.posX < gameState.playerWidth + 3 &&
    ball.posX - player.posX > -3 &&
    ball.velY > 0 &&
    ball.posY < gameState.height - 85 &&
    ball.posY > gameState.height - 100
  ) {
    gameState.hits++;
    if(gameState.hits > gameState.highscore) gameState.highscore = gameState.hits
    gameState.ball.velY += gameState.hitForce;
    gameState.ball.velY *= -1;
    gameState.ball.velX += (ball.posX - player.posX - 25) / 25;
  }
}

function checkBounds() {
  //player1
  if (gameState.player1.posX < 0) gameState.player1.posX += 10;
  if (gameState.player1.posX > gameState.width - gameState.playerWidth)
    gameState.player1.posX += -10;
  //player2
  if (gameState.player2.posX < 0) gameState.player2.posX += 10;
  if (gameState.player2.posX > gameState.width - gameState.playerWidth)
    gameState.player2.posX += -10;
  //ball
  if (gameState.ball.posX < gameState.ballR) gameState.ball.velX *= -0.98;
  if (gameState.ball.posX > gameState.width - gameState.ballR)
    gameState.ball.velX *= -0.98;
  if (gameState.ball.posY > gameState.height - gameState.ballR) {
    gameState.hits = 0;
    gameState.ball.velY *= -0.98;
  }
}

// gameLoop

let intervalId: number;

function startGame() {
  intervalId = setInterval(() => {
    gameState.tick++;
    runPhysics()
    broadcast()
  }, 1000 / 90); 

  setTimeout(() => {
    clearInterval(intervalId);
    console.log("Gameloop is over.");
  }, 1000000); 
}

startGame()

// let lastTime = performance.now();

// function serverAnimationLoop() {
//   const currentTime = performance.now();
//   const deltaTime = currentTime - lastTime;
//   lastTime = currentTime;

//   gameState.tick++;
//   runPhysics();
//   broadcast()

//   const targetIntervalMs = 1000 / gameState.frameRate *1.5;
//   const delay = Math.max(0, targetIntervalMs - deltaTime);
//   setTimeout(serverAnimationLoop, delay);
// }

// setTimeout(serverAnimationLoop, 0);




