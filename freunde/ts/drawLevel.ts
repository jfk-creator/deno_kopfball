import p5 from "p5";
import { Ball, game, GameState, levelWins, Player, props } from "./types";
import { sprites } from "./game";
import { clientData } from "./kopfball";
import { getNextPlayerId, getPlayerId, runPhysics } from "./physics";

export function drawLevel(p5: p5, players: Player[]) {
  const serverGameState: GameState = {
    props: props,
    game: game,
    players: players,
    ball: ball,
    levelWins: levelWins,
  };

  runPhysics(serverGameState);
  drawBackground(p5);
  drawBall(p5, ball, game.nextPlayer);
  drawPlayers(p5, players);
  // drawNextPlayerCircle(p5, game.nextPlayer);
  drawUi(p5);
}

function drawBackground(p5: p5) {
  p5.background(20);
}

function drawBall(p5: p5, ball: Ball, nextPlayerId: number) {
  console.log("key:", key);
  console.log(nextPlayerId);
  // if (!players[nextPlayerId])
  //   nextPlayerId = getNextPlayerId(players, nextPlayerId);
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
  }

  p5.textSize(20);
  p5.textAlign(p5.RIGHT);
  p5.text("Highscore: " + game.highscore, props.width - 12, offset);
  p5.text("Score: " + game.score, props.width - 12, offset + lineBreak);
}
