export let gameState = initGameState();

export function initGameState() {
  return {
    props: {
      frameRate: 90,
      width: 960,
      height: 540,
    },
    game: {
      tick: 0,
      ids: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      playerCount: 1,
      highscore: 0,
      score: 0,
      hits: 0,
      nextPlayer: 0,
    },
    scenes: {},
    levels: {
      level1: {
        win: 10000,
      },
      level2: {
        win: 50000,
      },
    },
    player: [
      {
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
      },
    ],
    ball: {
      posX: 460,
      posY: 20,
      velX: Math.random() * 8 - 4,
      velY: -2,
      gravity: 0.1,
      airDrag: 0.995,
      ballR: 8,
    },
  };
  return gameState;
}

console.log("Gamestate size (kb): ", JSON.stringify(gameState).length * 2);

// #region runPhysics
export function runPhysics(gs) {
  for (let i = 0; i < gs.player.length; i++) {
    gs.player[i] = movePlayer(gs.player[i]);
  }
  gs.ball = ballPhysics(gs.ball);
  gs.ball = moveBall(gs.ball);
  for (let i = 0; i < gs.player.length; i++) {
    gs.ball = kopfball(gs.player[i], gs.ball);
  }

  return gs;
}
// #endregion
export function resetBall() {
  return {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.1,
    airDrag: 0.995,
    ballR: 8,
  };
}
function movePlayer(player) {
  player.posX += player.velX;
  player.posY += player.velY;

  if (player.posX < 0) player.posX += 10;
  if (player.posX > gameState.props.width - player.playerWidth)
    player.posX += -10;
  player = resistance(player);
  player = playerPhysics(player);
  return player;
}
function resistance(player) {
  player.velX *= player.resistance;
  const factor = Math.pow(10, 10);
  player.velY = Math.floor(player.velY * factor) / factor;
  return player;
}

function playerPhysics(player) {
  if (player.posY <= gameState.props.height) player.velY += player.gravity * 2;
  else {
    player.velY = 0;
    player.posY = gameState.props.height;
  }

  return player;
}

function moveBall(ball) {
  ball.posX += ball.velX;
  ball.posY += ball.velY;

  if (ball.posX < 0 + ball.ballR) ball.velX *= -1;
  if (ball.posX > gameState.props.width - ball.ballR) ball.velX *= -1;
  return ball;
}
// #region ballPhysics
function ballPhysics(ball) {
  ball.velY += ball.gravity;
  ball.velY *= ball.airDrag;
  ball.velX *= ball.airDrag;
  if (ball.posY > gameState.props.height - ball.ballR) {
    ball.velY *= -0.999;
    gameState.game.hits = 0;
    gameState.game.score = 0;
  }
  const factor = Math.pow(10, 10);
  ball.velY = Math.floor(ball.velY * factor) / factor;
  return ball;
}

// #region Kopfball
function kopfball(player, ball) {
  if (
    ball.posX - player.posX < player.playerWidth + 3 &&
    ball.posX - player.posX > -3 &&
    ball.velY > 0 &&
    ball.posY <
      player.posY -
        player.playerHeight -
        player.playerOffset +
        15 -
        ball.ballR &&
    ball.posY >
      player.posY - player.playerHeight - player.playerOffset - ball.ballR
  ) {
    if (player.id == gameState.game.nextPlayer) {
      gameState.game.hits++;
      gameState.game.score += Math.floor(
        (ball.velX + ball.velY) * Math.pow(10, 3)
      );
      if (gameState.game.score > gameState.game.highscore) {
        gameState.game.highscore = gameState.game.score;
        localStorage.setItem("highscore", gameState.game.highscore);
      }

      gameState.game.nextPlayer = getNextPlayerId(
        gameState.player,
        gameState.game.nextPlayer
      );
    } else {
      gameState.game.hits = 0;
      gameState.game.score = 0;
    }

    ball.velY += -player.velY * player.hitForce;
    ball.velY *= -1;
    ball.velX += ((ball.posX - player.posX - player.playerWidth / 2) / 25) * 4;
    return ball;
  }
  return ball;
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
