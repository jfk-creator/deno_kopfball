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
    console.log("Receiveed message: ", event.data);
    p1_vel.x = parseFloat(event.data);
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

function broadcast(message: any) {
  for (const socket of sockets) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  }
}

const width = 960;
const height = 540
const centerX = width/2
const centerY = height/2
let time = Date.now()
let ball = {
  x: centerX,
  y: centerY
}
let p1_vel = {
  x: 0,
  y: 0
}
let p1 = {
  x: centerX,
  y: centerY,
};
let ball_vel = {
  x: 0,
  y: 0,
}

let gameState = {
  p1: p1,
  ball: ball,
  time: time
}



function moveBall() {
  const friction = 1.125;
  const gravity = 0.01;
  ball.x += ball_vel.x;
  ball.y += ball_vel.y;

  gameState.p1.x += p1_vel.x;
  p1_vel.x = p1_vel.x/friction;
  console.log("p1:", p1.x)

  if (gameState.p1.x > width) gameState.p1.x = width - 50;
  if (gameState.p1.x < 0) gameState.p1.x = 100;

  ball_vel.x /= friction;
  ball_vel.y += gravity;

  if (ball.y > height - 5) ball_vel.y *= -1;
  if (ball.x > width - 5) ball_vel.x *= -1;
  if (ball.x < 0 + 5) ball_vel.x *= -1;
  gameState.ball = ball;
  gameState.time = Date.now()
  return gameState;
}

let intervalId: number; // Speichert die ID des Intervalls

function startInterval() {
  intervalId = setInterval(() => {
    broadcast(JSON.stringify(moveBall()))
  }, 1000 / 120
); 

  setTimeout(() => {
    clearInterval(intervalId);
    console.log("gameOver");
  }, 1000000); // 10000 Millisekunden = 10 Sekunden
}

startInterval(); // Starte den Intervall