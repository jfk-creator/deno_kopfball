export let gameState = {
  frameRate: 90,
  playerCount: 2,
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
  player: [
    { posX: 20, posY: 540, velX: 1, velY: 0, id: 0, color: "#FF757F" },
    { posX: 80, posY: 540, velX: 1, velY: 0, id: 1, color: "#9ECE6A" },
  ],
  ball: {
    posX: 480,
    posY: 20,
    velX: (Math.random()*8)-4,
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
    player: [
      { posX: 20, posY: 540, velX: 1, velY: 0, id: 0, color: "#FF757F" },
      { posX: 80, posY: 540, velX: 1, velY: 0, id: 1, color: "#9ECE6A" },
    ],
    ball: {
      posX: 70,
      posY: 540 / 2,
      velX: Math.random() * 8 - 4,
      velY: -2,
    },
    nextPlayer: 0,
  };
  return gameState
}

console.log("Gamestate size (kb): ", JSON.stringify(gameState).length*2)

export function runPhysics(gs) {
  for(let i = 0; i < gs.player.length; i++){
    gs.player[i] = movePlayer(gs.player[i]);
  }
  gs.ball = ballPhysics(gs.ball)
  gs.ball = moveBall(gs.ball)
  for (let i = 0; i < gs.player.length; i++) {
    kopfball(gs.player[i], gs.ball);
  }

  return gs

}
function movePlayer(player){
  player.posX += player.velX;
  player.posY += player.velY;

  if (player.posX < 0) player.posX += 10;
  if (player.posX > gameState.width - gameState.playerWidth) player.posX += -10;
  player = resistance(player);

  return player;
}
function moveBall({posX, posY, velX, velY}) {
    posX += velX;
    posY += velY;

    if (posX < 0 + gameState.ballR) velX *= -1;
    if (posX > gameState.width - gameState.ballR)
      velX *= -1;;
    return {posX, posY, velX, velY}
}

function ballPhysics({ posX, posY, velX, velY }) {
  velY += gameState.gravity;
  velY *= gameState.airDrag;
  velX *= gameState.airDrag;
  if (Math.abs(velY) < 0.001 && posY > gameState.height - 30) initGameState();
  if (posY > gameState.height) {
    velY *= -0.98;
    gameState.hits = 0;
  }
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
    console.log((gameState.nextPlayer) % gameState.player.length);
    
    if(player.id == (gameState.nextPlayer) % gameState.player.length){
      gameState.hits++ 
      gameState.nextPlayer++
    } else {
      gameState.hits = 0; 
    }
    if (gameState.hits > gameState.highscore)
          gameState.highscore = gameState.hits;
 
    gameState.ball.velY += gameState.hitForce;
    gameState.ball.velY *= -1;
    gameState.ball.velX += (ball.posX - player.posX - 25)/25;
  };
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

