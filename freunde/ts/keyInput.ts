import p5 from "p5";

export function keyInput(p5: p5, socket: WebSocket) {
  // a <-
  if (p5.keyIsDown(65) || p5.keyIsDown(p5.LEFT_ARROW)) {
    player.velX = -player.movementSpeed;
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        type: "moveL",
      };
      socket.send(JSON.stringify(paket));
    }
  }
  // d ->
  if (p5.keyIsDown(68) || p5.keyIsDown(p5.RIGHT_ARROW)) {
    player.velX = player.movementSpeed;
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        type: "moveR",
      };
      socket.send(JSON.stringify(paket));
    }
  }
  //Dash a <-
  if (
    (p5.keyIsDown(65) || p5.keyIsDown(p5.LEFT_ARROW)) &&
    p5.keyIsDown(p5.SHIFT)
  ) {
    player.velX = -player.dashSpeed;
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        type: "dashL",
      };
      socket.send(JSON.stringify(paket));
    }
  }
  //Dash d ->
  if (
    (p5.keyIsDown(68) || p5.keyIsDown(p5.RIGHT_ARROW)) &&
    p5.keyIsDown(p5.SHIFT)
  ) {
    player.velX = player.dashSpeed;
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        type: "dashR",
      };
      socket.send(JSON.stringify(paket));
    }
  }
  // r: reload
  if (p5.keyIsDown(82) && p5.keyIsDown(p5.SHIFT)) {
    console.log("reloading game");
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        type: "reload",
      };
      socket.send(JSON.stringify(paket));
    }
  }
  // Jump, w, ^, space
  if (p5.keyIsDown(87) || p5.keyIsDown(p5.UP_ARROW) || p5.keyIsDown(32)) {
    player.velY = player.jumpSpeed;
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        type: "jump",
      };
      socket.send(JSON.stringify(paket));
    }
  }
}
