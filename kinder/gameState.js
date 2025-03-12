
export const gameState = {
  frameRate: 60,
  width: 960,
  height: 540,
  playerWidth: 50,
  ballDia: 10,
  tick: 0,
  player1: {
    posX: 20,
    posY: 540,
    velX: 1,
    velY: 10,
  },
  player2: {
    posX: 0,
    posY: 540,
    velX: 0,
    velY: 0,
  },
  ball: {
    posX: 0,
    posY: 0,
    velX: 0,
    velY: 0,
  },
};

export function runPhysics() {
    //player1
    gameState.player1 = move(
      gameState.player1.posX,
      gameState.player1.posY,
      gameState.player1.velX,
      gameState.player1.velY
    );
    //player2
    gameState.player2 = move(
      gameState.player2.posX,
      gameState.player2.posY,
      gameState.player2.velX,
      gameState.player2.velY
    );
    //ball
    gameState.ball = move(
      gameState.ball.posX,
      gameState.ball.posY,
      gameState.ball.velX,
      gameState.ball.velY
    );
}

function move({posX, posY, velX, velY}) {
    posX += velX;
    posY += velY;
    return {posX, posY, velX, velY}
}

function checkBounds() {
  //player1
  if (gameState.player1.posX < playerWidth) gameState.player1.posX = playerWidth;
  if (gameState.player1.posX > width - playerWidth) gameState.player1.posX = width - playerWidth;
  //player2
  if (gameState.player2.posX < playerWidth) gameState.player2.posX = 0;
  if (gameState.player2.posX > width - playerWidth) gameState.player2.posX = width - playerWidth;
  //ball
  if (gameState.ball.posX < ballDia / 2) gameState.ball.velX *= -1;
  if (gameState.ball.posX > width - (ballDia / 2)) gameState.ball.velX *= -1;
  if (gameState.ball.posY > height) gameState.ball.velY *= -1;
}
