const sockets = new Set<WebSocket>();

Deno.serve({ port: 420 }, (request) => {
  if (request.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  if (sockets.size >= 2) {
    console.error(
      "Incomming connection denied. It's only a 2 player game. "
    );
    return new Response("Server full.", { status: 429});
  }
  const { socket, response } = Deno.upgradeWebSocket(request);
  handleSocket(socket);
  return response;
});

function handleSocket(socket: WebSocket) {
  sockets.add(socket);
  
  socket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  socket.onmessage = (event) => {
    console.log("Received message: ", JSON.parse(event.data));
    gameState = JSON.parse(event.data);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    sockets.delete(socket);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error: ", error);
    sockets.delete(socket);
  };
}

function broadcast() {
  for (const socket of sockets) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(gameState));
    }
  }
}

let intervalId: number; // Speichert die ID des Intervalls

function startGame() {
  intervalId = setInterval(() => {
    broadcast()
    runPhysics()
  }, 1000 / 60
); 

  setTimeout(() => {
    clearInterval(intervalId);
    console.log("Gameloop is over.");
  }, 1000000); // 10000 Millisekunden = 10 Sekunden
}

startGame(); // Starte den Intervall



// gamestate

let gameState = {
  frameRate: 60,
  width: 960,
  height: 540,
  playerWidth: 50,
  ballDia: 10,
  tick: 0,
  player1: {
    posX: 20,
    posY: 540,
    velX: 5,
    velY: 0,
  },
  p1_custom: {
    color: "#FF757F",
  },
  player2: {
    posX: 960 - 70,
    posY: 540,
    velX: -2,
    velY: 0,
  },
  p2_custom: {
    color: "#7DCFFF",
  },
  ball: {
    posX: 0,
    posY: 0,
    velX: 0,
    velY: 0,
  },
};

function runPhysics() {
  //player1
  gameState.player1 = move(gameState.player1);
  //player2
  gameState.player2 = move(gameState.player2);
  //ball
  gameState.ball = move(gameState.ball);
  //CheckBounds for all objects:
  checkBounds();
}

interface vec4 {
  posX: number,
  posY: number,
  velX: number,
  velY: number
}

function move({ posX, posY, velX, velY }: vec4) {
  posX += velX;
  posY += velY;
  return { posX, posY, velX, velY };
}

// function checkBounds() {
//   //player1
//   if (gameState.player1.posX < 0) gameState.player1.posX = 0;
//   if (gameState.player1.posX > gameState.width - gameState.playerWidth) gameState.player1.posX = gameState.width - gameState.playerWidth;
//   //player2
//   if (gameState.player2.posX < 0) gameState.player2.posX = 0;
//   if (gameState.player2.posX > gameState.width - gameState.playerWidth) gameState.player2.posX = gameState.width - gameState.playerWidth;
//   //ball
//   if (gameState.ball.posX < gameState.ballDia / 2) gameState.ball.velX *= -1;
//   if (gameState.ball.posX > gameState.width - (gameState.ballDia / 2)) gameState.ball.velX *= -1;
//   if (gameState.ball.posY > gameState.height) gameState.ball.velY *= -1;
// }

function checkBounds() {
  //player1
  if (gameState.player1.posX < 0) gameState.player1.velX *= -1;
  if (gameState.player1.posX > gameState.width - gameState.playerWidth)
    gameState.player1.velX *= -1;
  //player2
  if (gameState.player2.posX < 0) gameState.player2.velX *= -1;
  if (gameState.player2.posX > gameState.width - gameState.playerWidth)
    gameState.player2.velX *= -1;
  //ball
  if (gameState.ball.posX < gameState.ballDia / 2) gameState.ball.velX *= -1;
  if (gameState.ball.posX > gameState.width - gameState.ballDia / 2)
    gameState.ball.velX *= -1;
  if (gameState.ball.posY > gameState.height) gameState.ball.velY *= -1;
}
