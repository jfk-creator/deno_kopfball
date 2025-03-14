import {runPhysics, gameState, initGameState }from "../kinder/gameState.js";
const sockets = new Set<WebSocket>();
const maxConnection = 10
const colorArr = [
  "#EFB662", // Tokyo Gold
  "#7DCFFF", // Tokyo Skyblue
  "#7AA2F7", // Tokyo Blue
  "#FF5733", // Vivid Red-Orange
  "#33FF57", // Bright Lime Green
  "#5733FF", // Deep Purple
  "#FF33E6", // Magenta-Pink
  "#33E6FF", // Cyan-Blue
  "#E6FF33", // Yellow-Green
  "#FF9933", // Amber-Orange
  "#3399FF", // Light Blue
  "#9933FF", // Violet
  "#FF3399", // Rose-Pink
];
let serverGameState = gameState;
let socketCounter = 0;
let gamestarted = false


Deno.serve({ port: 420 }, (request) => {
  if (request.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  if (sockets.size >= maxConnection) {
    console.error(
      "Server full"
    );
    return new Response("Server full.", { status: 429});
  }
  const { socket, response } = Deno.upgradeWebSocket(request);
  handleSocket(socket);
  return response;
});

function handleSocket(socket: WebSocket) {
  sockets.add(socket);
  serverGameState = initGameState()
  serverGameState.playerCount = sockets.size
  serverGameState.player.push({ posX: serverGameState.width/2, posY: 540, velX: 1, velY: 0, id: sockets.size, color: colorArr[sockets.size%colorArr.length] })

  socket.onopen = () => {
    console.log(`we found player${socketCounter+1}`);
    const paket = {
      id: socketCounter++,
      gs: serverGameState,
    };
    socket.send(JSON.stringify(paket));
  };

  socket.onmessage = (event) => {
    const paket = JSON.parse(event.data);
    console.log("Received message: ", paket);
    serverGameState.player[paket.id].velX = paket.velX
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    sockets.delete(socket);
    socketCounter--;
    serverGameState = initGameState();
  };

  socket.onerror = (error) => {
    console.error("WebSocket error: ", error);
    sockets.delete(socket);
  };
}

function broadcast() {
  for (const socket of sockets) {
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        id: socketCounter,
        gs: serverGameState,
      };
      socket.send(JSON.stringify(paket));
    }
  }
}


// gameLoop

let intervalId: number;

function startGame() {
  intervalId = setInterval(() => {
    serverGameState.tick++;
    runPhysics(serverGameState)
    broadcast()
  }, 1000 / 90); 

  setTimeout(() => {
    clearInterval(intervalId);
    console.log("Gameloop is over.");
  }, 1000000); 
}

startGame()

// let lastTime = performance.now();

// function serverAnimationLoop() {
//   const currentTime = performance.now();
//   const deltaTime = currentTime - lastTime;
//   lastTime = currentTime;

//   gameState.tick++;
//   runPhysics();
//   broadcast()

//   const targetIntervalMs = 1000 / gameState.frameRate *1.5;
//   const delay = Math.max(0, targetIntervalMs - deltaTime);
//   setTimeout(serverAnimationLoop, delay);
// }

// setTimeout(serverAnimationLoop, 0);




