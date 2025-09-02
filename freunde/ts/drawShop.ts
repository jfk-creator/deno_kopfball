import p5 from "p5";
import { Ball, game, GameState, levelWins, Player, props } from "./types";
import { sprites } from "./game";
import { clientData } from "./kopfball";
import {
  checkPlayersPos,
  getNextPlayerId,
  getPlayerId,
  runPhysics,
} from "./physics";

export function drawShop(p5: p5, players: Player[]) {
  const serverGameState: GameState = {
    props: props,
    game: game,
    players: players,
    ball: ball,
    levelWins: levelWins,
  };

  runPhysics(serverGameState);
  drawBackground(p5);
  drawPlayers(p5, players);
  drawUi(p5, players);
}

function drawBackground(p5: p5) {
  p5.background(40);
}

function drawBall(p5: p5, ball: Ball, nextPlayerId: number) {
  if (players[nextPlayerId]) p5.fill(players[nextPlayerId].color);
  else nextPlayerId = getNextPlayerId(players, nextPlayerId);
  const playerId: number = getPlayerId(players, nextPlayerId);
  p5.fill(players[playerId].color);
  p5.circle(ball.posX, ball.posY, ball.ballR);
}

function drawPlayers(p5: p5, players: Player[]) {
  for (const playerInst of players) {
    drawPlayer(p5, playerInst);
  }
}

function drawPlayer(p5: p5, playerInst: Player) {
  p5.imageMode(p5.CORNER);
  p5.image(
    sprites[playerInst.id % 5],
    playerInst.posX,
    playerInst.posY - playerInst.playerHeight - playerInst.playerOffset
  );
  if (clientData.debug) {
    // Draw Hitbox
    p5.noFill();
    p5.strokeWeight(1);
    p5.stroke(200, 200, 0);
    p5.rect(
      playerInst.posX,
      playerInst.posY - playerInst.playerHeight - playerInst.playerOffset,
      playerInst.playerWidth,
      playerInst.playerHeight
    );
    p5.noStroke();
    p5.fill(255);
  }
  p5.fill(playerInst.color);
  p5.textSize(16);
  p5.textAlign(p5.CENTER);
  p5.text(
    playerInst.name,
    playerInst.posX + playerInst.playerWidth / 2,
    props.height - 5
  );
}

function drawNextPlayerCircle(p5: p5, nextPlayerId: number) {
  if (players[nextPlayerId]) p5.fill(players[nextPlayerId].color);
  else nextPlayerId = getNextPlayerId(players, nextPlayerId);
  const playerId: number = getPlayerId(players, nextPlayerId);
  p5.fill(players[playerId].color);
  p5.circle(props.width / 2, 50, 50);
}

function drawUi(p5: p5, playersArr: Player[]) {
  const lineBreak = 25;
  const offset = 35;
  p5.fill("#E5F0F4");
  p5.textSize(64);
  p5.textFont("Orbit");
  p5.textAlign(p5.CENTER);
  p5.text("SHOP ", props.width / 2, 75);

  drawItemLoadingBar(p5, 1);
  drawItemLoadingBar(p5, 2);
  drawItemLoadingBar(p5, 3);

  p5.textSize(24);
  p5.text("jump++", (1 * props.width) / 6, 250);
  p5.text("dash++", (3 * props.width) / 6, 250);
  p5.text("hit++", (5 * props.width) / 6, 250);
}

function drawItemLoadingBar(p5: p5, bar: number) {
  p5.noStroke();
  p5.fill(220);
  p5.rect(
    ((bar - 1) * props.width) / 3,
    275,
    game.itemLoadingBar[bar - 1],
    props.offset
  );
}
