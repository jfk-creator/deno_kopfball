import p5 from "p5";
import { socket, id } from "./kind.ts";
import { gameState as gs, resetBall, runPhysics } from "./gameState.ts";

let importedModule;
let gameState = gs;
let initGameState;
let playerInfo;
let debug = false;
let sprites;
let ballSprite;

const sketch = (p: p5) => {
  p.preload = () => {
    sprites = [
      p.loadImage("./assets/chonki_yellow.png"),
      p.loadImage("./assets/chonki_orange.png"),
      p.loadImage("./assets/chonki_blue.png"),
      p.loadImage("./assets/chonki_green.png"),
      p.loadImage("./assets/chonki_red.png"),
    ];
    ballSprite = p.loadImage("./assets/balli.png");
  };

  p.setup = () => {
    playerInfo = document.getElementById("players");
    //   import("./gameState.js").then((module) => {
    //     importedModule = module;

    //     gameState = importedModule.gameState;
    //     initGameState = importedModule.initGameState;
    //     runPhysics = importedModule.runPhysics;
    //     frameRate(gameState.props.frameRate);
    //     gameState.player = [];
    //     if (!connectionInitialized) {
    //       gameState.player.push({
    //         posX: 480,
    //         posY: 540,
    //         velX: Math.random() * 50 - 25,
    //         velY: 0,
    //         id: 0,
    //         ping: 0,
    //         name: "Hans",
    //         color: "#FFA905",
    //         playerWidth: 64,
    //         playerHeight: 64,
    //         playerOffset: 20,
    //         movementSpeed: 5,
    //         jumpSpeed: -3,
    //         dashSpeed: 15,
    //         resistance: 0.8999,
    //         gravity: 0.1,
    //         hitForce: 1.2,
    //         jumpCooldown: 0,
    //       });
    //       gameState.player.push({
    //         posX: 480,
    //         posY: 540,
    //         velX: Math.random() * 50 - 25,
    //         velY: 0,
    //         id: 1,
    //         ping: 0,
    //         name: "Laura",
    //         color: "#FF5400",
    //         playerWidth: 64,
    //         playerHeight: 64,
    //         playerOffset: 20,
    //         movementSpeed: 5,
    //         jumpSpeed: -3,
    //         dashSpeed: 15,
    //         resistance: 0.8999,
    //         gravity: 0.1,
    //         hitForce: 1.2,
    //         jumpCooldown: 0,
    //       });
    //     }
    //     gameState.game.ids[0] = 1;
    //     gameState.game.ids[1] = 1;
    //     const playerName = localStorage.getItem("playerName");
    //     const localHighscore = localStorage.getItem("highscore");
    //     if (playerName) {
    //       gameState.player[0].name = playerName;
    //     }
    //     if (localHighscore) gameState.game.highscore = localHighscore;
    //   });

    gameState.player = [];
    if (true) {
      gameState.player.push({
        posX: 480,
        posY: 540,
        velX: Math.random() * 50 - 25,
        velY: 0,
        id: 0,
        ping: 0,
        name: "Hans",
        color: "#FFA905",
        playerWidth: 64,
        playerHeight: 64,
        playerOffset: 20,
        movementSpeed: 5,
        jumpSpeed: -3,
        dashSpeed: 15,
        resistance: 0.8999,
        gravity: 0.1,
        hitForce: 1.2,
        jumpCooldown: 0,
      });
      gameState.player.push({
        posX: 480,
        posY: 540,
        velX: Math.random() * 50 - 25,
        velY: 0,
        id: 1,
        ping: 0,
        name: "Laura",
        color: "#FF5400",
        playerWidth: 64,
        playerHeight: 64,
        playerOffset: 20,
        movementSpeed: 5,
        jumpSpeed: -3,
        dashSpeed: 15,
        resistance: 0.8999,
        gravity: 0.1,
        hitForce: 1.2,
        jumpCooldown: 0,
      });
    }
    gameState.game.ids[0] = 1;
    gameState.game.ids[1] = 1;
    const playerName = localStorage.getItem("playerName");
    const localHighscore = localStorage.getItem("highscore");
    if (playerName) {
      gameState.player[0].name = playerName;
    }
    if (localHighscore) gameState.game.highscore = localHighscore;

    let canvas = p.createCanvas(960, 540);
    canvas.parent("theater");
  };
  // #region Draw
  p.draw = () => {
    if (gameState.player.length > 0) {
      switch (gameState.game.level) {
        case 1:
          if (gameState.game.score <= gameState.levels.level1.win) {
            // if (false) {
            level1();
          } else {
            shop1();
          }
          break;
        case 2:
          if (gameState.game.score <= gameState.levels.level2.win) {
            level1();
          } else {
            shop1();
          }
          break;
        case 3:
          if (gameState.game.score <= gameState.levels.level2.win) {
            level1();
          } else {
            shop1();
          }
          break;
        case 4:
          if (gameState.game.score <= gameState.levels.level2.win) {
            level1();
          } else {
            shop1();
          }
          break;

        default:
          p.background(70);
          console.error("no level selected");
          break;
      }
    }
  };

  // #region DrawPlayer
  function drawPlayer(player) {
    p.imageMode(p.CORNER);
    p.image(
      sprites[player.id % 5],
      player.posX,
      player.posY - player.playerHeight - player.playerOffset
    );
    if (debug) {
      // Draw Hitbox
      p.noFill();
      p.strokeWeight(1);
      p.stroke(200, 200, 0);
      p.rect(
        player.posX,
        player.posY - player.playerHeight - player.playerOffset,
        player.playerWidth,
        player.playerHeight
      );
      p.noStroke();
      p.fill(255);
    }

    p.textSize(16);
    p.textAlign(p.CENTER);
    p.text(
      player.name,
      player.posX + player.playerWidth / 2,
      gameState.props.height - 5
    );
  }
  // #endregion

  function drawBall(ball) {
    p.fill(200);
    p.circle(ball.posX, ball.posY, ball.ballR * 2);
  }

  function drawText() {
    const lineBreak = 25;
    const offset = 35;
    p.fill("#E5F0F4");
    p.textSize(20);
    p.textFont("Urbanist");
    p.textAlign(p.LEFT);
    if (gameState.game.level === 1)
      p.text("You need: " + gameState.levels.level1.win, 12, offset);
    if (gameState.game.level === 2)
      p.text("You need: " + gameState.levels.level2.win, 12, offset);
    p.textAlign(p.RIGHT);
    p.text(
      "Highscore: " + gameState.game.highscore,
      gameState.props.width - 12,
      offset
    );
    p.text(
      "Score: " + gameState.game.score,
      gameState.props.width - 12,
      offset + lineBreak
    );
  }

  function drawNextPlayerCircle() {
    let playerId = getPlayerId(gameState.player, gameState.game.nextPlayer);
    if (playerId === -1) {
      console.error("drawCircle, couln't find player");
    }
    p.fill(gameState.player[playerId].color);
    p.circle(gameState.props.width / 2, 50, 50);
  }

  function getPlayerId(players, key) {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === key) {
        // console.log(`found id: ${players[i].id} as: ${i}`);
        return i;
      }
    }
    return -1;
  }

  function getNextPlayerId(players, key) {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === key) {
        if (i < players.length - 1) return players[i + 1].id;
        else return players[0].id;
      }
    }
  }

  // #region keyInput
  function keyInput() {
    if (id === -1) {
      // a <-
      if (p.keyIsDown(65)) {
        gameState.player[0].velX = -gameState.player[0].movementSpeed;
      }
      // d ->
      if (p.keyIsDown(68)) {
        gameState.player[0].velX = gameState.player[0].movementSpeed;
      }
      // DASH a <-
      if (p.keyIsDown(65) && p.keyIsDown(p.SHIFT)) {
        gameState.player[0].velX = -gameState.player[0].dashSpeed;
      }
      // DASH d ->
      if (p.keyIsDown(68) && p.keyIsDown(p.SHIFT)) {
        gameState.player[0].velX = gameState.player[0].dashSpeed;
      }
      // Player2
      if (p.keyIsDown(p.LEFT_ARROW)) {
        gameState.player[1].velX = -gameState.player[1].movementSpeed;
      }
      // Player2
      if (p.keyIsDown(p.RIGHT_ARROW)) {
        gameState.player[1].velX = gameState.player[1].movementSpeed;
      }

      // DASH a <-
      if (p.keyIsDown(p.LEFT_ARROW) && p.keyIsDown(p.SHIFT)) {
        gameState.player[1].velX = -gameState.player[1].dashSpeed;
      }
      // DASH d ->
      if (p.keyIsDown(p.RIGHT_ARROW) && p.keyIsDown(p.SHIFT)) {
        gameState.player[1].velX = gameState.player[1].dashSpeed;
      }
      // r
      if (p.keyIsDown(82) && p.keyIsDown(p.CONTROL)) {
        gameState = initGameState();
      }
    } else {
      const playerId = getPlayerId(gameState.player, id);
      // a <-
      if (p.keyIsDown(65) || p.keyIsDown(p.LEFT_ARROW)) {
        gameState.player[playerId].velX =
          -gameState.player[playerId].movementSpeed;
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "moveL",
          };
          socket.send(JSON.stringify(paket));
        }
      }
      // d ->
      if (p.keyIsDown(68) || p.keyIsDown(p.RIGHT_ARROW)) {
        gameState.player[playerId].velX =
          gameState.player[playerId].movementSpeed;
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "moveR",
          };
          socket.send(JSON.stringify(paket));
        }
      }
      //Dash a <-
      if (
        (p.keyIsDown(65) || p.keyIsDown(p.LEFT_ARROW)) &&
        p.keyIsDown(p.SHIFT)
      ) {
        gameState.player[playerId].velX = -gameState.player[playerId].dashSpeed;
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "dashL",
          };
          socket.send(JSON.stringify(paket));
        }
      }
      //Dash d ->
      if (
        (p.keyIsDown(68) || p.keyIsDown(p.RIGHT_ARROW)) &&
        p.keyIsDown(p.SHIFT)
      ) {
        gameState.player[playerId].velX = gameState.player[playerId].dashSpeed;
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "dashR",
          };
          socket.send(JSON.stringify(paket));
        }
      }
      // r
      if (p.keyIsDown(82) && p.keyIsDown(p.CONTROL)) {
        console.log("reloading game");
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "reload",
          };
          socket.send(JSON.stringify(paket));
        }
      }
      if (p.mouseIsPressed) {
        if (p.mouseX < p.width / 2) {
          gameState.player[playerId].velX =
            -gameState.player[playerId].movementSpeed;
          if (socket.readyState === WebSocket.OPEN) {
            const paket = {
              type: "moveL",
            };
            socket.send(JSON.stringify(paket));
          }
        }
        // ->
        if (p.mouseX > gameState.props.width / 2) {
          gameState.player[playerId].velX =
            -gameState.player[playerId].movementSpeed;
          if (socket.readyState === WebSocket.OPEN) {
            const paket = {
              type: "moveR",
            };
            socket.send(JSON.stringify(paket));
          }
        }
      }
    }
  }
  // #endregion

  // #region jumping
  p.keyPressed = () => {
    if (p.keyIsDown(20)) {
      debug = !debug;
    }
    if (id === -1) {
      if (
        p.keyCode === 87 &&
        Date.now() - gameState.player[0].jumpCooldown > 600
      ) {
        gameState.player[0].jumpCooldown = Date.now();
        gameState.player[0].velY = gameState.player[0].jumpSpeed;
      }
      if (
        p.keyCode === p.UP_ARROW &&
        Date.now() - gameState.player[1].jumpCooldown > 600
      ) {
        gameState.player[1].jumpCooldown = Date.now();
        gameState.player[1].velY = gameState.player[1].jumpSpeed;
      }
    } else {
      const playerId = getPlayerId(gameState.player, id);
      if (p.keyCode === 87 || p.keyCode === p.UP_ARROW || p.keyCode === 32) {
        gameState.player[playerId].velY = gameState.player[playerId].jumpSpeed;
        if (socket.readyState === WebSocket.OPEN) {
          const paket = {
            type: "jump",
            id: id,
          };
          socket.send(JSON.stringify(paket));
        }
      }
    }
  };

  function level1() {
    p.background(20);
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

    if (p.frameCount % 10 == 0) {
      // playerInfo.innerHTML = "";
      for (let i = 0; i < gameState.player.length; i++) {
        let player = gameState.player[i];
        //   playerInfo.innerHTML += `<span style="color: ${player.color}">${player.id}. ${player.name}: ${player.ping}</span></br>`;
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

  function shop1() {
    p.noStroke();
    if (fadeCounter <= 255) {
      fadeCounter += fadeCounter / 20;
      level1();
      p.fill(0, 0, 0, fadeCounter);
      p.rect(0, 0, gameState.props.width, gameState.props.height);
    } else {
      p.background(20);
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
            p.fill(shopCounter, 0, 0);
            p.rect(
              0,
              0,
              gameState.props.width / 3,
              gameState.props.height - gameState.props.offset
            );
            p.fill(255);
            p.textSize(32);
            p.textAlign(p.CENTER);
            p.text("Jump++", gameState.props.width / 6, 150);
            break;
          case 2:
            p.fill(0, shopCounter, 0);
            p.rect(
              gameState.props.width / 3,
              0,
              gameState.props.width / 3,
              gameState.props.height - gameState.props.offset
            );
            p.fill(255);
            p.textSize(32);
            p.textAlign(p.CENTER);
            p.text("Dash++", gameState.props.width / 2, 150);
            break;
          case 3:
            p.fill(0, 0, shopCounter);
            p.rect(
              (2 * gameState.props.width) / 3,
              0,
              gameState.props.width / 3,
              gameState.props.height - gameState.props.offset
            );
            p.fill(255);
            p.textSize(32);
            p.textAlign(p.CENTER);
            p.text("Hit++", (gameState.props.width * 5) / 6, 150);
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
        gameState.ball = resetBall();
        gameState.game.level++;
        gameState.game.score = 0;
        resetShop();
      }

      keyInput();
      gameState = runPhysics(gameState);
      gameState.ball = resetBall();
      drawPlayer(gameState.player[0]);
      drawPlayer(gameState.player[1]);
    }
  }
};

new p5(sketch);
