import {gameState, runPhysics} from "../kinder/gameState.js"

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


let intervalId: number; // Speichert die ID des Intervalls

function startGame() {
  intervalId = setInterval(() => {
    broadcast(JSON.stringify(runPhysics()))
  }, 1000 / 60
); 

  setTimeout(() => {
    clearInterval(intervalId);
    console.log("Gameloop is over.");
  }, 90); // 10000 Millisekunden = 10 Sekunden
}

startGame(); // Starte den Intervall