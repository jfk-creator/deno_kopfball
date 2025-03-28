import {
  Ball,
  ballArr,
  game,
  GameState,
  levelWins,
  Player,
  props,
  resetBall,
} from "./types.ts";

export function runPhysics(gameState: GameState): GameState {
  for (let i = 0; i < gameState.players.length; i++) {
    gameState.players[i] = playerPhysics(gameState.players[i]);
  }

  if (gameState.game.drawLevel) {
    // levelTime
    countScoreCounter();
    gameState.ball = ballPhysics(gameState.ball);
    for (let i = 0; i < gameState.players.length; i++) {
      gameState.ball = kopfball(
        gameState.players[i],
        gameState.ball,
        gameState.players
      );
    }
  }

  if (!gameState.game.drawLevel) {
    // shopTime
    handleItemLoading(gameState.players);
    if (gameState.game.drawLevel) gameState.ball = resetBall(game.level - 1);
  }
  return gameState;
}
let positionChanged = 0;

function countScoreCounter() {
  if (game.score - game.scoreCounter > 1000) game.scoreCounter += 1000;
  if (game.score - game.scoreCounter > 100) game.scoreCounter += 100;
  if (game.score - game.scoreCounter > 0) game.scoreCounter += 1;
}

function handleItemLoading(playersArr: Player[]) {
  let loadedItem = 0;
  if (loadedItem === 0) {
    for (let i = 0; i < 3; i++) {
      if (checkPlayersPos(playersArr, i + 1)) {
        if (positionChanged != i) {
          positionChanged = i;
          setItemLoadingBarZero();
        }
        if (game.itemLoadingBar[i] < props.width / 3)
          game.itemLoadingBar[i] += (game.itemLoadingBar[i] + 1) / 25;
        else {
          loadedItem = i;
          setItem(loadedItem, playersArr);
          game.drawLevel = true;
          game.level++;
        }
      }
    }
  }
}

function setItem(loadedItem: number, playerArr: Player[]) {
  if (loadedItem === 0) {
    for (let i = 0; i < playerArr.length; i++) {
      playerArr[i].jumpSpeed -= 1;
    }
  }
  if (loadedItem === 1) {
    for (let i = 0; i < playerArr.length; i++) {
      playerArr[i].dashSpeed += 2;
    }
  }
  if (loadedItem === 2) {
    for (let i = 0; i < playerArr.length; i++) {
      playerArr[i].hitForce += 0.2;
    }
  }
  if (loadedItem > 2 || loadedItem < 0) console.error("loadedItemError");
}

function setItemLoadingBarZero() {
  for (let i = 0; i < 3; i++) {
    game.itemLoadingBar[i] = 0;
  }
}

function playerPhysics(playerInst: Player): Player {
  playerInst = movePlayer(playerInst);
  playerInst = addResistance(playerInst);
  playerInst = addGravity(playerInst);
  playerInst = playerBoundingBoxes(playerInst);
  playerInst.posX = cutDecimal(playerInst.posX, 3);
  playerInst.posY = cutDecimal(playerInst.posY, 3);
  playerInst.velX = cutDecimal(playerInst.velX, 3);
  playerInst.velY = cutDecimal(playerInst.velY, 3);
  return playerInst;
}

function ballPhysics(ballInst: Ball): Ball {
  lastBall = JSON.parse(JSON.stringify(ballInst));
  ballInst = moveBall(ballInst);
  ballInst = addBallResistance(ballInst);
  ballInst = addBallGravity(ballInst);
  ballInst = ballBoundingBoxes(ballInst);
  ballInst = getBallSpeed(ballInst);
  ballInst.posX = cutDecimal(ballInst.posX, 3);
  ballInst.posY = cutDecimal(ballInst.posY, 3);
  ballInst.velX = cutDecimal(ballInst.velX, 3);
  ballInst.velY = cutDecimal(ballInst.velY, 3);
  ballInst.ballSpeed = cutDecimal(ballInst.ballSpeed, 3);
  return ballInst;
}
export let lastBall: Ball;
function getBallSpeed(ballInst: Ball): Ball {
  ballInst.ballSpeed = Math.pow(
    (lastBall.posX - ballInst.posX) * (lastBall.posX - ballInst.posX) +
      (lastBall.posY - ballInst.posY) * (lastBall.posY - ballInst.posY),
    0.5
  );
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
  if (playerInst.posY < props.height) playerInst.velY += playerInst.gravity * 2;
  else {
    playerInst.velY = 0;
    playerInst.posY = props.height;
  }
  return playerInst;
}

function playerBoundingBoxes(playerInst: Player): Player {
  if (playerInst.posX < 0) playerInst.velX = 15;
  if (playerInst.posX > props.width - playerInst.playerWidth)
    playerInst.velX = -15;
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
  ballInst.velY += ballInst.gravity;
  return ballInst;
}

function ballBoundingBoxes(ballInst: Ball): Ball {
  if (ballInst.posX < 0 + ballInst.ballR) ballInst.velX *= -1;
  if (ballInst.posX > props.width - ballInst.ballR) ballInst.velX *= -1;
  if (ballInst.posY > props.height - ballInst.ballR) {
    ballInst.velY *= -0.999;
    game.hits = 0;
    game.score = 0;
    game.scoreCounter = 0;
  }
  return ballInst;
}

function kopfball_old(
  playerInst: Player,
  ballInst: Ball,
  playerArr: Player[]
): Ball {
  if (
    ballInst.posX - playerInst.posX < playerInst.playerWidth + 3 &&
    ballInst.posX - playerInst.posX > -3 &&
    ballInst.velY > 0 &&
    ballInst.posY <
      playerInst.posY -
        playerInst.playerHeight -
        playerInst.playerOffset +
        15 -
        ballInst.ballR / 2 &&
    ballInst.posY >
      playerInst.posY -
        playerInst.playerHeight -
        playerInst.playerOffset -
        ballInst.ballR / 2
  ) {
    if (playerInst.id == game.nextPlayer) {
      game.hits++;
      game.score += Math.floor(ballInst.ballSpeed * Math.pow(10, 3));
      if (game.score > game.highscore) {
        game.highscore = game.score;
        localStorage.setItem("highscore", JSON.stringify(game.highscore));
      }
      if (game.score > levelWins[(game.level - 1) % levelWins.length]) {
        game.drawLevel = false;
        game.score = 0;
        setItemLoadingBarZero();
      }

      game.nextPlayer = getNextPlayerId(playerArr, game.nextPlayer);
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

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
) {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  let denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  // Lines are parallel
  if (denominator === 0) {
    return false;
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1);
  let y = y1 + ua * (y2 - y1);

  return { x, y };
}

function kopfball(
  playerInst: Player,
  ballInst: Ball,
  playerArr: Player[]
): Ball {
  if (
    intersect(
      lastBall.posX,
      lastBall.posY - ballInst.ballR / 2,
      ballInst.posX,
      ballInst.posY + ballInst.ballR / 2,
      playerInst.posX,
      playerInst.posY - playerInst.playerHeight - playerInst.playerOffset,
      playerInst.posX + playerInst.playerWidth,
      playerInst.posY - playerInst.playerHeight - playerInst.playerOffset
    ) &&
    ballInst.velY > 0
  ) {
    if (playerInst.id == game.nextPlayer) {
      game.hits++;
      let scoreHit = Math.floor(ballInst.ballSpeed * Math.pow(10, 3));
      game.score += scoreHit;
      if (scoreHit > game.bestHit) game.bestHit = scoreHit;
      if (game.score > game.highscore) game.highscore = game.score;
      if (game.score > levelWins[(game.level - 1) % levelWins.length]) {
        game.drawLevel = false;
        game.score = 0;
        game.scoreCounter = 0;
        setItemLoadingBarZero();
      }

      game.nextPlayer = getNextPlayerId(playerArr, game.nextPlayer);
    } else {
      game.hits = 0;
      game.score = 0;
      game.scoreCounter = 0;
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

export function getPlayerId(players: Player[], key: number): number {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === key) {
      // console.log(`found id: ${players[i].id} as: ${i}`);
      return i;
    }
  }
  return -1;
}

function cutDecimal(number: number, cut: number): number {
  const factor = Math.pow(10, cut);
  return Math.floor(number * factor) / factor;
}

export function checkPlayersPos(playersArr: Player[], window: number): boolean {
  let onWindow = 0;
  for (const playerInst of playersArr) {
    if (
      playerInst.posX <= (window * props.width) / 3 &&
      playerInst.posX >= ((window - 1) * props.width) / 3
    ) {
      onWindow++;
    }
  }
  if (onWindow === playersArr.length) return true;
  else {
    return false;
  }
}
