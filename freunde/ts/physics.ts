import { GameState, Player, props } from "./types";

export function runPhysics(gameState: GameState): GameState {
  // gameState.players.forEach((playerInst) => {
  //   playerInst = playerPhysics(playerInst);
  // });
  for (let i = 0; i < gameState.players.length; i++) {
    gameState.players[i] = playerPhysics(gameState.players[i]);
  }
  return gameState;
}

function playerPhysics(playerInst: Player): Player {
  playerInst = movePlayer(playerInst);
  playerInst = addResistance(playerInst);
  playerInst = addGravity(playerInst);
  playerInst = playerBoundingBoxes(playerInst);
  return playerInst;
}

function movePlayer(playerInst: Player): Player {
  console.log("hello");
  playerInst.posX += playerInst.velX;
  playerInst.posY += playerInst.velY;
  return playerInst;
}

function addResistance(playerInst: Player): Player {
  playerInst.velX *= playerInst.resistance;
  playerInst.velX = cutDecimal(playerInst.velX, 10);
  return playerInst;
}

function addGravity(playerInst: Player): Player {
  if (player.posY <= props.height) player.velY += player.gravity * 2;
  else {
    player.velY = 0;
    player.posY = props.height;
  }
  playerInst.velY = cutDecimal(playerInst.velY, 10);
  return playerInst;
}

function playerBoundingBoxes(playerInst: Player): Player {
  if (player.posX < 0) player.velX += 20;
  if (player.posX > props.width - player.playerWidth) player.velX += -20;
  return playerInst;
}

function cutDecimal(number: number, cut: number): number {
  const factor = Math.pow(10, cut);
  return Math.floor(number * factor) / factor;
}
