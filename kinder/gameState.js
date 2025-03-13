let gameState = {
  frameRate: 90,
  width: 960,
  height: 540,
  playerWidth: 50,
  movementSpeed: 1,
  resistance: 0.899,
  hitForce: 1.5,
  gravity: 0.25,
  airDrag: 0.995,
  ballR: 5,
  tick: 0,
  hits: 0,
  player1: {
    posX: 20,
    posY: 540,
    velX: 5,
    velY: 0,
  },
  p1_custom: {
    color: "#FF757F",
  },
  player2: {
    posX: 960 - 70,
    posY: 540,
    velX: -2,
    velY: 0,
  },
  p2_custom: {
    color: "#7DCFFF",
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
    movementSpeed: 1,
    resistance: 0.899,
    hitForce: 1.5,
    gravity: 0.25,
    airDrag: 0.995,
    ballR: 5,
    tick: 0,
    hits: 0,
    player1: {
      posX: 20,
      posY: 540,
      velX: 5,
      velY: 0,
    },
    p1_custom: {
      color: "#FF757F",
    },
    player2: {
      posX: 960 - 70,
      posY: 540,
      velX: -2,
      velY: 0,
    },
    p2_custom: {
      color: "#7DCFFF",
    },
    ball: {
      posX: 70,
      posY: 540 / 2,
      velX: 2,
      velY: -2,
    },
  };
}

console.log("Gamestate size (kb): " ,JSON.stringify(gameState).length*2)
function runPhysics() {
    //player1
    gameState.player1 = move(gameState.player1);
    gameState.player1 = resistance(gameState.player1);
    //player2
    gameState.player2 = move(gameState.player2);
    gameState.player2 = resistance(gameState.player2);
    //ball
    gameState.ball = move(gameState.ball);
    gameState.ball = ballPhysics(gameState.ball);
    //CheckBounds for all objects: 
    checkBounds();
    kopfball(gameState.player1, gameState.ball);
    kopfball(gameState.player2, gameState.ball);
}

function move({posX, posY, velX, velY}) {
    posX += velX;
    posY += velY;
    
    return {posX, posY, velX, velY}
}

function ballPhysics({ posX, posY, velX, velY }) {
  velY += gameState.gravity;
  velY *= gameState.airDrag;
  velX *= gameState.airDrag;
  if (Math.abs(velY) < 0.001 && posY > gameState.height - 30) initGameState();
  const factor = Math.pow(10, 10);
  velY = (Math.floor(velY * factor) / factor);
  return { posX, posY, velX, velY };
}

function resistance(player) {
  player.velX *= gameState.resistance;
  const factor = Math.pow(10, 10);
  player.velY = Math.floor(player.velY * factor) / factor;
  return player
}

function kopfball(player, ball) {
  if (
    ball.posX - player.posX < gameState.playerWidth + 3 &&
    ball.posX - player.posX > -3 &&
    ball.velY > 0 &&
    ball.posY < gameState.height - 85 &&
    ball.posY > gameState.height - 100
  ) {
    gameState.hits++  
    gameState.ball.velY += gameState.hitForce;
    gameState.ball.velY *= -1;
    gameState.ball.velX += (ball.posX - player.posX - 25)/25;
  };
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

