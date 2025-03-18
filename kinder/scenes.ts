import {
  drawPlayer,
  keyInput,
  drawBall,
  drawText,
  drawNextPlayerCircle,
} from "./main";
import { gameState as gs, runPhysics } from "./gameState";

let gameState = gs;
export function level1() {
  background(20);
  drawNextPlayerCircle();
  drawText();
  for (let i = 0, k = 0; i < gameState.game.ids.length; i++) {
    if (gameState.game.ids[i] === 1) {
      let player = gameState.player[k++];
      drawPlayer(player);
    }
  }
  drawBall(gameState.ball);

  keyInput();
  gameState = runPhysics(gameState);

  if (frameCount % 10 == 0) {
    playerInfo.innerHTML = "";
    for (let i = 0; i < gameState.player.length; i++) {
      let player = gameState.player[i];
      playerInfo.innerHTML += `<span style="color: ${player.color}">${player.id}. ${player.name}: ${player.ping}</span></br>`;
    }
  }
}

let fadeCounter = 255;
let shopCounter = 200;
let shopPos = 0;
let newShopPos = false;

function resetShop() {
  fadeCounter = 255;
  shopCounter = 200;
  shopPos = 0;
  newShopPos = false;
}

export function shop1() {
  noStroke();
  if (fadeCounter <= 255) {
    fadeCounter += fadeCounter / 20;
    level1();
    fill(0, 0, 0, fadeCounter);
    rect(0, 0, gameState.props.width, gameState.props.height);
  } else {
    background(20);
    if (shopCounter > 0) {
      if (
        gameState.player[0].posX <= gameState.props.width / 3 &&
        gameState.player[1].posX <= gameState.props.width / 3
      ) {
        if (shopPos != 1) shopCounter = 200;
        shopCounter--;
        shopPos = 1;
      } else if (
        gameState.player[0].posX >= gameState.props.width / 3 &&
        gameState.player[0].posX <= (2 * gameState.props.width) / 3 &&
        gameState.player[1].posX >= gameState.props.width / 3 &&
        gameState.player[1].posX <= (2 * gameState.props.width) / 3
      ) {
        if (shopPos != 2) shopCounter = 200;
        shopCounter--;
        shopPos = 2;
      } else if (
        gameState.player[0].posX >= (2 * gameState.props.width) / 3 &&
        gameState.player[1].posX >= (2 * gameState.props.width) / 3
      ) {
        if (shopPos != 3) shopCounter = 200;
        shopCounter--;
        shopPos = 3;
      }

      switch (shopPos) {
        case 1:
          fill(shopCounter, 0, 0);
          rect(
            0,
            0,
            gameState.props.width / 3,
            gameState.props.height - gameState.props.offset
          );
          fill(255);
          textSize(32);
          textAlign(CENTER);
          text("Jump++", gameState.props.width / 6, 150);
          break;
        case 2:
          fill(0, shopCounter, 0);
          rect(
            gameState.props.width / 3,
            0,
            gameState.props.width / 3,
            gameState.props.height - gameState.props.offset
          );
          fill(255);
          textSize(32);
          textAlign(CENTER);
          text("Dash++", gameState.props.width / 2, 150);
          break;
        case 3:
          fill(0, 0, shopCounter);
          rect(
            (2 * gameState.props.width) / 3,
            0,
            gameState.props.width / 3,
            gameState.props.height - gameState.props.offset
          );
          fill(255);
          textSize(32);
          textAlign(CENTER);
          text("Hit++", (gameState.props.width * 5) / 6, 150);
        default:
          break;
      }
    } else {
      switch (shopPos) {
        case 1:
          gameState.player[0].jumpSpeed -= 2;
          gameState.player[1].jumpSpeed -= 2;
          break;
        case 2:
          gameState.player[0].dashSpeed += 10;
          gameState.player[1].dashSpeed += 10;
          break;
        case 3:
          gameState.player[0].hitForce += 0.02;
          gameState.player[1].dashSpeed += 10;
          break;
      }
      gameState.ball = importedModule.resetBall();
      gameState.game.level++;
      gameState.game.score = 0;
      resetShop();
    }

    keyInput();
    gameState = importedModule.runPhysics(gameState);
    gameState.ball = importedModule.resetBall();
    drawPlayer(gameState.player[0]);
    drawPlayer(gameState.player[1]);
  }
}
