import { htmlObjects } from "./kopfball";
import { game } from "./types";

let socketI: WebSocket;
let id = -1;
let maxConnection = 5;
let connectionInitialized = false;

export function connectWebSocket() {
  htmlObjects.info.innerHTML += `</br>trying to connect to: ${server_addr}</br>`;
  socketI = new WebSocket(server_addr);
  globalThis.socket = socketI;
  socketI.addEventListener("open", () => {
    console.log("connected to server");
    htmlObjects.info.innerHTML += `connected to server </br>`;
  });
  handleConnection(socket);
}

function handleConnection(socket: WebSocket) {
  socket.addEventListener("message", (event) => {
    let paket = JSON.parse(event.data);
    if (paket.type == "init" && !connectionInitialized) {
      globalThis.key = paket.key;
      globalThis.players = paket.players;
      globalThis.ball = paket.ball;
      game.nextPlayer = paket.nextPlayer;
      for (const playerFromServer of players) {
        if (playerFromServer.id == key) globalThis.player = playerFromServer;
      }
      htmlObjects.info.innerHTML += `Hallo Freund ${key + 1}</br>`;
      connectionInitialized = true;
      if (key > maxConnection) {
        htmlObjects.info.innerHTML += "closing Connection.</br>";
        socket.close();
        connectionInitialized = false;
      } else {
        const playerName = localStorage.getItem("playerName");
        if (playerName) {
          const paket = {
            type: "changeName",
            name: playerName,
          };
          socket.send(JSON.stringify(paket));
        }
      }
    }
    if (connectionInitialized) {
      if (paket.type == "gameState") {
        players = paket.players;
        ball = paket.ball;
        game.nextPlayer = paket.nextPlayer;
        game.score = paket.score;
        game.level = paket.level;
        game.drawLevel = paket.drawLevel;
        game.itemLoadingBar = paket.itemLoadingBar;
      }
      if (paket.type == "ping") {
        if (!paket.pong) {
          paket.pong = true;
          paket.id = id;
          socket.send(JSON.stringify(paket));
        }
      }
      if (paket.type == "score") {
        game.score = paket.score;
      }
    }
  });
  socket.addEventListener("close", () => {
    console.log("disconnected from server");
    htmlObjects.info.innerHTML += `disconnected from server </br>`;
  });
}
