import { GameState, Player } from "./types";

export function runPhysics(gameState: GameState): GameState {
  gameState.players.forEach((player) => {
    player = playerPhysics(player);
  });
  return gameState;
}

function playerPhysics(player: Player): Player {
  player = movePlayer(player);
  player = addResistance(player);
  player = addGravity(player);
  player = boundingBoxes(player);
  return player;
}
