export let gameState = {
  frameRate: 90,
  playerCount: 2,
  width: 960,
  height: 540,
  playerWidth: 64,
  playerHeight: 64,
  playerOffset: 20,
  movementSpeed: 5,
  jumpSpeed: -3,
  dashSpeed: 15,
  resistance: 0.8999,
  hitForce: 1.2,
  gravity: 0.1,
  airDrag: 0.995,
  ballR: 8,
  tick: 0,
  hits: 0,
  score: 0,
  highscore: 0,
  ids: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  player: [
    {
      posX: 480,
      posY: 540,
      velX: Math.random() * 50 - 25,
      velY: 0,
      id: 0,
      ping: 0,
      name: "Hans",
      color: "#FF757F",
      jumpCooldown: 0,
    },
  ],
  ball: {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
  },
  nextPlayer: 0,
};

export function initGameState() {
  gameState = {
    frameRate: 90,
    playerCount: 2,
    width: 960,
    height: 540,
    playerWidth: 64,
    playerHeight: 64,
    playerOffset: 20,
    movementSpeed: 5,
    jumpSpeed: -3,
    dashSpeed: 15,
    resistance: 0.8999,
    hitForce: 0.5,
    gravity: 0.1,
    airDrag: 0.995,
    ballR: 8,
    tick: 0,
    hits: 0,
    score: 0,
    highscore: 0,
    ids: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    player: [
      // {
      //   posX: 480,
      //   posY: 540,
      //   velX: Math.random() * 50 - 25,
      //   velY: 0,
      //   id: 0,
      //   ping: 0,
      //   name: "Hans",
      //   color: "#FF757F",
      //   jumpCooldown: 0,
      // },
      // {
      //   posX: 480,
      //   posY: 540,
      //   velX: Math.random() * 50 - 25,
      //   velY: 0,
      //   id: 1,
      //   ping: 0,
      //   name: "Laura",
      //   color: "#9ECE6A",
      //   jumpCooldown: 0,
      // },
    ],
    ball: {
      posX: 460,
      posY: 20,
      velX: Math.random() * 8 - 4,
      velY: -2,
    },
    nextPlayer: 0,
  };
  return gameState;
}

console.log("Gamestate size (kb): ", JSON.stringify(gameState).length * 2);

export function runPhysics(gs) {
  for (let i = 0; i < gs.player.length; i++) {
    gs.player[i] = movePlayer(gs.player[i]);
  }
  gs.ball = ballPhysics(gs.ball);
  gs.ball = moveBall(gs.ball);
  for (let i = 0; i < gs.player.length; i++) {
    kopfball(gs.player[i], gs.ball);
  }

  return gs;
}

export function resetBall() {
  return {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
  };
}
function movePlayer(player) {
  player.posX += player.velX;
  player.posY += player.velY;

  if (player.posX < 0) player.posX += 10;
  if (player.posX > gameState.width - gameState.playerWidth) player.posX += -10;
  player = resistance(player);
  player = playerPhysics(player);
  return player;
}
function playerPhysics(player) {
  if (player.posY <= gameState.height) player.velY += gameState.gravity * 2;
  else {
    player.velY = 0;
    player.posY = gameState.height;
  }

  return player;
}

function moveBall({ posX, posY, velX, velY }) {
  posX += velX;
  posY += velY;

  if (posX < 0 + gameState.ballR) velX *= -1;
  if (posX > gameState.width - gameState.ballR) velX *= -1;
  return { posX, posY, velX, velY };
}
// #region ballPhysics
function ballPhysics({ posX, posY, velX, velY }) {
  velY += gameState.gravity;
  velY *= gameState.airDrag;
  velX *= gameState.airDrag;
  if (posY > gameState.height - gameState.ballR) {
    velY *= -0.999;
    gameState.hits = 0;
    gameState.score = 0;
  }
  const factor = Math.pow(10, 10);
  velY = Math.floor(velY * factor) / factor;
  return { posX, posY, velX, velY };
}

function resistance(player) {
  player.velX *= gameState.resistance;
  const factor = Math.pow(10, 10);
  player.velY = Math.floor(player.velY * factor) / factor;
  return player;
}
// #region Kopfball
function kopfball(player, ball) {
  if (
    ball.posX - player.posX < gameState.playerWidth + 3 &&
    ball.posX - player.posX > -3 &&
    ball.velY > 0 &&
    ball.posY <
      player.posY -
        gameState.playerHeight -
        gameState.playerOffset +
        15 -
        gameState.ballR &&
    ball.posY >
      player.posY -
        gameState.playerHeight -
        gameState.playerOffset -
        gameState.ballR
  ) {
    if (player.id == gameState.nextPlayer) {
      gameState.hits++;
      gameState.score += Math.floor((ball.velX + ball.velY) * Math.pow(10, 3));
      if (gameState.score > gameState.highscore) {
        gameState.highscore = gameState.score;
        localStorage.setItem("highscore", gameState.highscore);
      }

      gameState.nextPlayer = getNextPlayerId(
        gameState.player,
        gameState.nextPlayer
      );
    } else {
      gameState.hits = 0;
      gameState.score = 0;
    }

    gameState.ball.velY += -player.velY * gameState.hitForce;
    gameState.ball.velY *= -1;
    gameState.ball.velX +=
      ((ball.posX - player.posX - gameState.playerWidth / 2) / 25) * 4;
  }
}

// #endregion
function getNextPlayerId(players, key) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === key) {
      if (i < players.length - 1) return players[i + 1].id;
      else return players[0].id;
    }
  }
}

// gameLoop

// let intervalId;

// function startGame() {
//   intervalId = setInterval(() => {
//     runPhysics();
//   }, 1000 / gameState.frameRate);

//   setTimeout(() => {
//     clearInterval(intervalId);
//     console.log("Gameloop is over.");
//   }, 1000000);
// }

// startGame()
