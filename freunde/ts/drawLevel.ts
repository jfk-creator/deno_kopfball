import p5 from "p5";
import { Ball, game, GameState, levelWins, Player, props } from "./types";
import { sprites } from "./game";
import { clientData } from "./kopfball";
import { getNextPlayerId, getPlayerId, lastBall, runPhysics } from "./physics";

export function drawLevel(p5: p5, players: Player[]) {
  const serverGameState: GameState = {
    props: props,
    game: game,
    players: players,
    ball: ball,
    levelWins: levelWins,
  };

  if (serverGameState.ball) {
    runPhysics(serverGameState);
    drawBackground(p5);
    drawBall(p5, ball, game.nextPlayer);
    drawPlayers(p5, players);
    // drawNextPlayerCircle(p5, game.nextPlayer);
    drawUi(p5);
    drawHitBox(p5, serverGameState);
  }
}

function drawBackground(p5: p5) {
  p5.background(20);
}

function drawBall(p5: p5, ball: Ball, nextPlayerId: number) {
  // if c(!players[nextPlayerId])
  //   nextPlayerId = getNextPlayerId(players, nextPlayerId);
  const playerId: number = getPlayerId(players, nextPlayerId);
  
  if(players[playerId]) p5.fill(players[playerId].color);
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

function drawUi(p5: p5) {
  const player = players[getPlayerId(players, key)];
  const lineBreak = 25;
  const smallLineBreak = 12;
  const offset = 35;
  p5.fill("#E5F0F4");
  p5.textSize(20);
  p5.textFont("Orbit");

  p5.textAlign(p5.LEFT);
  p5.text("Level" + game.level, 12, offset);
  p5.text(
    "You need: " + levelWins[(game.level - 1) % levelWins.length],
    12,
    offset + lineBreak
  );
  if (debug) {
    p5.textSize(8);
    p5.text("Stats: ", 12, offset * 3 + smallLineBreak * 2);
    p5.text("jump: " + player.jumpSpeed, 12, offset * 3 + smallLineBreak * 3);
    p5.text("dash: " + player.dashSpeed, 12, offset * 3 + smallLineBreak * 4);
    p5.text("hit: " + player.hitForce, 12, offset * 3 + smallLineBreak * 5);
    p5.text("X: " + player.posX, 12, offset * 3 + smallLineBreak * 6);
    p5.text("Y: " + player.posY, 12, offset * 3 + smallLineBreak * 7);
    p5.text("velX: " + player.velX, 12, offset * 3 + smallLineBreak * 8);
    p5.text("velY: " + player.velY, 12, offset * 3 + smallLineBreak * 9);
    p5.text("Ball", 12, offset * 3 + smallLineBreak * 10);
    p5.text("X: " + ball.posX, 12, offset * 3 + smallLineBreak * 11);
    p5.text("Y: " + ball.posY, 12, offset * 3 + smallLineBreak * 12);
    p5.text("velX: " + ball.velX, 12, offset * 3 + smallLineBreak * 13);
    p5.text("velY: " + ball.velY, 12, offset * 3 + smallLineBreak * 14);
    p5.text("speed: " + ball.ballSpeed, 12, offset * 3 + smallLineBreak * 15);
  }
  p5.textSize(64);
  p5.textAlign(p5.CENTER);
  let scoreDiff = game.scoreCounter / levelWins[game.level - 1];
  if (scoreDiff < 0.25) p5.fill("#E5F0F4");
  if (scoreDiff > 0.25) p5.fill("#c99716");
  if (scoreDiff > 0.4) p5.fill("#d68411");
  if (scoreDiff > 0.6) p5.fill("#e0600b");
  if (scoreDiff > 0.8) p5.fill("#f04c1a");
  if (scoreDiff > 0.9) p5.fill("#fc1408");

  p5.text(game.scoreCounter, props.width / 2, offset + lineBreak * 1.5);
  // right side:
  p5.fill("#E5F0F4");
  p5.textSize(20);
  p5.textAlign(p5.RIGHT);
  p5.text("Highscore: " + game.highscore, props.width - 12, offset);
  p5.text("BestHit: " + game.bestHit, props.width - 12, offset + lineBreak);
}

function drawHitBox(p5: p5, serverGameState: GameState) {
  if (debug) {
    p5.stroke(255);
    p5.strokeWeight(5);
    p5.line(
      lastBall.posX,
      lastBall.posY,
      serverGameState.ball.posX,
      serverGameState.ball.posY
    );
    p5.line(
      player.posX,
      player.posY - player.playerHeight - player.playerOffset,
      player.posX + player.playerWidth,
      player.posY - player.playerHeight - player.playerOffset
    );
    p5.noStroke();
  }
}
