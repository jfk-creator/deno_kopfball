
export let gameState = {
  frameRate: 60,
  width: 960,
  height: 540,
  playerWidth: 50,
  ballDia: 10,
  tick: 0,
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
    posX: 0,
    posY: 0,
    velX: 0,
    velY: 0,
  },
};

export function runPhysics() {
  //player1
  gameState.player1 = move(gameState.player1);
  //player2
  gameState.player2 = move(gameState.player2);
  //ball
  gameState.ball = move(gameState.ball);
  //CheckBounds for all objects:
  checkBounds();
}

function move({ posX, posY, velX, velY }) {
  posX += velX;
  posY += velY;
  return { posX, posY, velX, velY };
}

// function checkBounds() {
//   //player1
//   if (gameState.player1.posX < 0) gameState.player1.posX = 0;
//   if (gameState.player1.posX > gameState.width - gameState.playerWidth) gameState.player1.posX = gameState.width - gameState.playerWidth;
//   //player2
//   if (gameState.player2.posX < 0) gameState.player2.posX = 0;
//   if (gameState.player2.posX > gameState.width - gameState.playerWidth) gameState.player2.posX = gameState.width - gameState.playerWidth;
//   //ball
//   if (gameState.ball.posX < gameState.ballDia / 2) gameState.ball.velX *= -1;
//   if (gameState.ball.posX > gameState.width - (gameState.ballDia / 2)) gameState.ball.velX *= -1;
//   if (gameState.ball.posY > gameState.height) gameState.ball.velY *= -1;
// }

function checkBounds() {
  //player1
  if (gameState.player1.posX < 0) gameState.player1.velX *= -1;
  if (gameState.player1.posX > gameState.width - gameState.playerWidth)
    gameState.player1.velX *= -1;
  //player2
  if (gameState.player2.posX < 0) gameState.player2.velX *= -1;
  if (gameState.player2.posX > gameState.width - gameState.playerWidth)
    gameState.player2.velX *= -1;
  //ball
  if (gameState.ball.posX < gameState.ballDia / 2) gameState.ball.velX *= -1;
  if (gameState.ball.posX > gameState.width - gameState.ballDia / 2)
    gameState.ball.velX *= -1;
  if (gameState.ball.posY > gameState.height) gameState.ball.velY *= -1;
}
