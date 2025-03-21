import { Ball, game, GameState, Player, props } from "./types";

export function runPhysics(gameState: GameState): GameState {
  for (let i = 0; i < gameState.players.length; i++) {
    gameState.players[i] = playerPhysics(gameState.players[i]);
  }
  gameState.ball = ballPhysics(gameState.ball);
  for (let i = 0; i < gameState.players.length; i++) {
    gameState.ball = kopfball(gameState.players[i], ball);
  }
  return gameState;
}

function playerPhysics(playerInst: Player): Player {
  playerInst = movePlayer(playerInst);
  playerInst = addResistance(playerInst);
  playerInst = addGravity(playerInst);
  playerInst = playerBoundingBoxes(playerInst);
  playerInst.velX = cutDecimal(playerInst.velX, 10);
  playerInst.velY = cutDecimal(playerInst.velY, 10);
  return playerInst;
}

function ballPhysics(ballInst: Ball): Ball {
  ballInst = moveBall(ballInst);
  ballInst = addBallResistance(ballInst);
  ballInst = addBallGravity(ballInst);
  ballInst = ballBoundingBoxes(ballInst);
  ballInst.velX = cutDecimal(ballInst.velX, 10);
  ballInst.velY = cutDecimal(ballInst.velY, 10);
  return ballInst;
}

function movePlayer(playerInst: Player): Player {
  playerInst.posX += playerInst.velX;
  playerInst.posY += playerInst.velY;
  return playerInst;
}

function addResistance(playerInst: Player): Player {
  playerInst.velX *= playerInst.resistance;
  return playerInst;
}

function addGravity(playerInst: Player): Player {
  if (player.posY <= props.height) player.velY += player.gravity * 2;
  else {
    player.velY = 0;
    player.posY = props.height;
  }
  return playerInst;
}

function playerBoundingBoxes(playerInst: Player): Player {
  if (player.posX < 0) player.velX += 20;
  if (player.posX > props.width - player.playerWidth) player.velX += -20;
  return playerInst;
}

function moveBall(ballInst: Ball): Ball {
  ballInst.posX += ballInst.velX;
  ballInst.posY += ballInst.velY;
  return ballInst;
}

function addBallResistance(ballInst: Ball): Ball {
  ballInst.velY *= ballInst.airDrag;
  ballInst.velX *= ballInst.airDrag;
  return ballInst;
}

function addBallGravity(ballInst: Ball): Ball {
  ball.velY += ball.gravity;
  return ballInst;
}

function ballBoundingBoxes(ballInst: Ball): Ball {
  if (ballInst.posX < 0 + ballInst.ballR) ballInst.velX *= -1;
  if (ballInst.posX > props.width - ballInst.ballR) ballInst.velX *= -1;
  if (ballInst.posY > props.height - ballInst.ballR) {
    ballInst.velY *= -0.999;
    game.hits = 0;
    game.score = 0;
  }
  return ballInst;
}

function kopfball(playerInst: Player, ballInst: Ball): Ball {
  if (
    ballInst.posX - playerInst.posX < playerInst.playerWidth + 3 &&
    ballInst.posX - playerInst.posX > -3 &&
    ballInst.velY > 0 &&
    ballInst.posY <
      playerInst.posY -
        playerInst.playerHeight -
        playerInst.playerOffset +
        15 -
        ballInst.ballR &&
    ballInst.posY >
      playerInst.posY -
        playerInst.playerHeight -
        playerInst.playerOffset -
        ballInst.ballR
  ) {
    if (playerInst.id == game.nextPlayer) {
      game.hits++;
      game.score += Math.floor(
        (ballInst.velX + ballInst.velY) * Math.pow(10, 3)
      );
      if (game.score > game.highscore) {
        game.highscore = game.score;
        localStorage.setItem("highscore", JSON.stringify(game.highscore));
      }

      game.nextPlayer = getNextPlayerId(players, game.nextPlayer);
    } else {
      game.hits = 0;
      game.score = 0;
    }

    ballInst.velY += -playerInst.velY * playerInst.hitForce;
    ballInst.velY *= -1;
    ballInst.velX +=
      ((ballInst.posX - playerInst.posX - playerInst.playerWidth / 2) / 25) * 4;
    return ballInst;
  }
  return ballInst;
}

export function getNextPlayerId(players: Player[], playerId: number): number {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === playerId) {
      if (i < players.length - 1) return players[i + 1].id;
      else return players[0].id;
    }
  }
  return players[0].id;
}

function cutDecimal(number: number, cut: number): number {
  const factor = Math.pow(10, cut);
  return Math.floor(number * factor) / factor;
}
