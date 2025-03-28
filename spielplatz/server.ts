import {
  game,
  props,
  ball,
  levelWins,
  Player,
  Ball,
  Props,
  Game,
  resetBall,
  port,
} from "../freunde/ts/types.ts";
import { getPlayerFromArr } from "./src/freunde.ts";
import {
  deletePlayer,
  getPlayerId,
  printPlayer,
  saId,
  broadcast,
} from "./src/helper.ts";

import { runPhysics } from "../freunde/ts/physics.ts";

const debug = true;
const sockets = new Map<number, WebSocket>();
const maxConnection = 5;

interface ServerGameState {
  props: Props;
  game: Game;
  players: Player[];
  ball: Ball;
  levelWins: number[];
}

const serverGameState = {
  props: props,
  game: game,
  players: [] as Player[],
  ball: ball,
  levelWins: levelWins,
};

Deno.serve({ port: port }, (request) => {
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

function handleSocket(socket: WebSocket) {
  const key: number = saId(game.ids);
  game.ids[key] = 1;
  if (debug) console.log("ids: ", game.ids);
  if (debug) console.log("new key: ", key);

  sockets.set(key, socket);
  serverGameState.players.push(getPlayerFromArr(key));

  socket.onopen = () => {
    const paket = {
      type: "init",
      key: key,
      players: serverGameState.players,
    };
    socket.send(JSON.stringify(paket));
  };

  socket.onmessage = (event) => {
    const paket = JSON.parse(event.data);
    const playerId: number = getPlayerId(serverGameState.players, key);
    if (playerId === -1) {
      console.error(
        "player wasn't found: " + serverGameState.players + "key: " + key
      );
      return;
    }
    // #region ParseMessage
    if (debug) console.log("Received message: ", paket);
    if (paket.type === "changeName") {
      console.log(
        `%c${serverGameState.players[playerId].name} changed his name to: ${paket.name}`,
        "color: orange; font-weight: bold;"
      );
      serverGameState.players[playerId].name = paket.name;
      printPlayer(serverGameState.players);
    }
    if (paket.type == "moveL")
      serverGameState.players[playerId].velX =
        -serverGameState.players[playerId].movementSpeed;
    if (paket.type == "moveR")
      serverGameState.players[playerId].velX =
        serverGameState.players[playerId].movementSpeed;
    if (paket.type == "dashL")
      serverGameState.players[playerId].velX =
        -serverGameState.players[playerId].dashSpeed;
    if (paket.type == "dashR")
      serverGameState.players[playerId].velX =
        serverGameState.players[playerId].dashSpeed;
    if (paket.type == "jump") {
      console.log(
        performance.now() - serverGameState.players[playerId].jumpCooldown
      );
      if (
        performance.now() - serverGameState.players[playerId].jumpCooldown >
          500 &&
        serverGameState.players[playerId].posY >= props.height
      ) {
        serverGameState.players[playerId].velY =
          serverGameState.players[playerId].jumpSpeed;
        serverGameState.players[playerId].jumpCooldown = performance.now();
      }
    }

    if (paket.type == "ping") {
      if (paket.pong) {
        const timePing = performance.now() - paket.time;
        serverGameState.players[playerId].ping = Math.floor(timePing);
      }
    }
    if (paket.type == "reload") {
      console.log("reloading ball");

      serverGameState.ball = resetBall(serverGameState.game.level - 1);
    }
    // #endregion
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");

    sockets.delete(key);
    serverGameState.players = deletePlayer(serverGameState.players, key);
    console.log(serverGameState.players);
    serverGameState.game.ids[key] = 0;
    if (serverGameState.players.length != 0)
      serverGameState.game.nextPlayer = serverGameState.players[0].id;
    console.log(serverGameState.game.ids);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error: ", error);
    // sockets.delete(socket);
    sockets.delete(key);
  };
}

// #region: printPing
function printPing() {
  setInterval(() => {
    printPlayer(serverGameState.players);
  }, 5000);
}

printPing();
// gameLoop

let intervalId: number;

function startGame() {
  intervalId = setInterval(() => {
    serverGameState.game.tick++;
    runPhysics(serverGameState);
    broadcast(serverGameState, sockets);
  }, 1000 / 90);

  setTimeout(() => {
    clearInterval(intervalId);
    console.log("Gameloop is over.");
  }, 1000000);
}

startGame();
