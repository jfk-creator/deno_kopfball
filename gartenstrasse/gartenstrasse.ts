const sockets = new Set<WebSocket>();

Deno.serve((request) => {
  if (request.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(request);
  handleSocket(socket);
  return response;
});

function handleSocket(socket: WebSocket) {
  if(sockets.size < 2){
    sockets.add(socket);
  } else {
    console.error("Incomming connection denied. It's only a 2 player game. ");
    return;
  }

  socket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  socket.onmessage = (event) => {
    console.log("Receiveed message: ", event.data);
    broadcast(event.data);
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
let ball = {
  x: centerX,
  y: centerY
}
let ball_vel = {
  x: 0,
  y: 0,
}

function moveBall() {
  const friction = 1.003;
  const gravity = 0.01;
  ball.x += ball_vel.x;
  ball.y += ball_vel.y;

  ball_vel.x /= friction;
  ball_vel.y += gravity;

  if (ball.y > height - 5) ball_vel.y *= -1;
  if (ball.x > width - 5) ball_vel.x *= -1;
  if (ball.x < 0 + 5) ball_vel.x *= -1;
  return ball;
}

let intervalId: number; // Speichert die ID des Intervalls

function startInterval() {
  intervalId = setInterval(() => {
    console.log("Intervall wird ausgeführt");
    broadcast(JSON.stringify(moveBall()))
  }, 1000 / 60); // Beispiel: ungefähr 60 Mal pro Sekunde

  // Stoppe den Intervall nach 10 Sekunden
  setTimeout(() => {
    clearInterval(intervalId);
    console.log("Intervall gestoppt");
  }, 10000); // 10000 Millisekunden = 10 Sekunden
}

startInterval(); // Starte den Intervall