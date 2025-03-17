import {
  runPhysics,
  gameState,
  initGameState,
  resetBall,
} from "../kinder/gameState.js";

const debug = false;
// const sockets = new Set<WebSocket>();
const sockets = new Map<number, WebSocket>();
const maxConnection = 5;
const colorArr = [
  "#FFA905", // Tokyo Red
  "#FF5400", // Tokyo Gold
  "#1ED1FF", // Tokyo Skyblue
  "#9DED00", // Tokyo Blue
  "#F10047", // Vivid Red-Orange
];
let onStartUp = true;
let serverGameState = gameState;
let socketCounter = 0;

interface pingPakete {
  type: string;
  id: number;
  pong: boolean;
  time: number;
}

interface player {
  posX: number;
  posY: number;
  velX: number;
  velY: number;
  id: number;
  ping: number;
  name: string;
  color: string;
  jumpCooldown: number;
}

function saId(): number {
  for (let i = 0; i < serverGameState.ids.length; i++) {
    if (serverGameState.ids[i] === 0) {
      return i;
    }
  }
  return -1;
}

function getPlayerId(players: player[], key: number) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === key) {
      // if (debug) console.log(`found id: ${players[i].id} as: ${i}`);
      return i;
    }
  }
  return -1;
}

function deletePlayer(players: player[], key: number) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === key) {
      players.splice(i, 1);
      console.log("Good bye player:", key);
      return players;
    }
  }
  return players;
}

Deno.serve({ port: 420 }, (request) => {
  if (onStartUp) {
    onStartUp = false;
    serverGameState.player = [];
  }
  if (request.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  if (sockets.size >= maxConnection) {
    console.error("Server full");
    return new Response("Server full.", { status: 429 });
  }
  const { socket, response } = Deno.upgradeWebSocket(request);
  handleSocket(socket);
  return response;
});

function printPlayer(players: player[]) {
  console.log("%cActive players: ", "color: green");
  for (const player of players) {
    console.log(`Id: ${player.id}, Name: ${player.name}, Ping: ${player.ping}`);
  }
}

function handleSocket(socket: WebSocket) {
  const key = saId();
  serverGameState.ids[saId()] = 1;
  if (debug) console.log(serverGameState.ids);
  sockets.set(key, socket);
  serverGameState.ball = resetBall();
  serverGameState.playerCount = sockets.size;
  serverGameState.player.push({
    posX: 480,
    posY: 540,
    velX: Math.random() * 50 - 25,
    velY: 0,
    id: key,
    ping: 0,
    name: "Mr.Smith",
    color: colorArr[key % colorArr.length],
    jumpCooldown: 0,
  });

  socket.onopen = () => {
    const paket = {
      type: "init",
      id: key,
      gs: serverGameState,
    };
    socket.send(JSON.stringify(paket));
  };
  socket.onmessage = (event) => {
    const paket = JSON.parse(event.data);
    const playerId: number = getPlayerId(serverGameState.player, key);
    if (playerId === -1) {
      console.error(
        "player wasn't found: " + serverGameState.player + "key: " + key
      );
      return;
    }
    // #region ParseMessage
    if (debug) console.log("Received message: ", paket);
    if (paket.type === "changeName") {
      console.log(
        `%c${serverGameState.player[playerId].name} changed his name to: ${paket.name}`,
        "color: orange; font-weight: bold;"
      );
      serverGameState.player[playerId].name = paket.name;
      printPlayer(gameState.player);
    }
    if (paket.type == "moveL")
      serverGameState.player[playerId].velX = -serverGameState.movementSpeed;
    if (paket.type == "moveR")
      serverGameState.player[playerId].velX = serverGameState.movementSpeed;
    if (paket.type == "dashL")
      serverGameState.player[playerId].velX = -serverGameState.dashSpeed;
    if (paket.type == "dashR")
      serverGameState.player[playerId].velX = serverGameState.dashSpeed;
    if (paket.type == "jump") {
      console.log(
        performance.now() - serverGameState.player[playerId].jumpCooldown
      );
      if (
        performance.now() - serverGameState.player[playerId].jumpCooldown >
        500
      ) {
        serverGameState.player[playerId].velY = serverGameState.jumpSpeed;
        serverGameState.player[playerId].jumpCooldown = performance.now();
      }
    }

    if (paket.type == "ping") {
      if (paket.pong) {
        const timePing = performance.now() - paket.time;
        serverGameState.player[playerId].ping = Math.floor(timePing);
      }
    }
    if (paket.type == "reload") {
      serverGameState.ball = resetBall();
    }
    // #endregion
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    // sockets.delete(socket);
    sockets.delete(key);
    serverGameState.player = deletePlayer(serverGameState.player, key);
    console.log(serverGameState.player);
    socketCounter--;
    serverGameState.ids[key] = 0;
    if (serverGameState.player.length != 0)
      serverGameState.nextPlayer = serverGameState.player[0].id;
    console.log(serverGameState.ids);
    // serverGameState = initGameState();
  };

  socket.onerror = (error) => {
    console.error("WebSocket error: ", error);
    // sockets.delete(socket);
    sockets.delete(key);
  };
}

function broadcast() {
  for (const [id, socket] of sockets.entries()) {
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        type: "gameState",
        id: id,
        gs: serverGameState,
      };
      socket.send(JSON.stringify(paket));
      if (serverGameState.tick % serverGameState.frameRate == 0) {
        const pingPaket = {
          type: "ping",
          id: -1,
          pong: false,
          time: performance.now(),
        };
        socket.send(JSON.stringify(pingPaket));
      }
    }
  }
}

// #region: printPing
function printPing() {
  setInterval(() => {
    printPlayer(serverGameState.player);
  }, 5000);
}

printPing();
// gameLoop

let intervalId: number;

function startGame() {
  intervalId = setInterval(() => {
    serverGameState.tick++;
    runPhysics(serverGameState);
    broadcast();
  }, 1000 / 90);

  setTimeout(() => {
    clearInterval(intervalId);
    console.log("Gameloop is over.");
  }, 1000000);
}

startGame();

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
