import p5 from "p5";
import { game, levelWins, Player, props } from "./types";
import { sprites } from "./game";
import { clientData } from "./kopfball";

export function drawLevel(p5: p5, players: Player[]) {
  drawBackground(p5);
  drawPlayers(p5, players);
  drawUi(p5);
}

function drawBackground(p5: p5) {
  p5.background(20);
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

  p5.textSize(16);
  p5.textAlign(p5.CENTER);
  p5.text(
    playerInst.name,
    playerInst.posX + playerInst.playerWidth / 2,
    props.height - 5
  );
}

function drawUi(p5: p5) {
  const lineBreak = 25;
  const offset = 35;
  p5.fill("#E5F0F4");
  p5.textSize(20);
  p5.textFont("Orbit");
  p5.textAlign(p5.LEFT);
  p5.text("You need: " + levelWins[game.level], 12, offset);
  p5.textAlign(p5.RIGHT);
  p5.text("Highscore: " + game.highscore, props.width - 12, offset);
  p5.text("Score: " + game.score, props.width - 12, offset + lineBreak);
}
