import { connectWebSocket } from "./client.ts";
import { startGame } from "./game.ts";
import { ballArr, hans, laura } from "./types.ts";
interface HTMLObjects {
  info: HTMLElement;
  nameVal: HTMLInputElement;
  sendNameButton: HTMLButtonElement;
  playerInfo: HTMLElement;
}
interface LocalData {
  localPlayerName: string;
  localHighscore: number;
}
interface ClientData {
  key: number;
  debug: boolean;
}

let info = document.getElementById("info") as HTMLElement;
let nameVal = document.getElementById("name") as HTMLInputElement;
let sendNameButton = document.getElementById("sendName") as HTMLButtonElement;
let playerInfo = document.getElementById("playerInfo") as HTMLElement;

export const htmlObjects: HTMLObjects = {
  info: info,
  nameVal: nameVal,
  sendNameButton: sendNameButton,
  playerInfo: playerInfo,
};

export const localData: LocalData = {
  localPlayerName: "Hans",
  localHighscore: 0,
};

export const clientData: ClientData = {
  key: 0,
  debug: false,
};

function init() {
  const playerName = localStorage.getItem("playName");
  const highscore = localStorage.getItem("highscore");
  globalThis.server_addr = "ws://85.215.131.226:42069";
  globalThis.players = [hans, laura];
  globalThis.player = hans;
  globalThis.ball = ballArr[0];
  globalThis.debug = false;
  if (playerName) localData.localPlayerName = playerName;
  if (highscore) localData.localHighscore = parseFloat(highscore);
}

init();
if (htmlObjects) connectWebSocket();
startGame();

if (sendNameButton)
  sendNameButton.addEventListener("click", function () {
    if (nameVal) player.name = nameVal.value;
    nameVal.blur();
    localStorage.setItem("playerName", nameVal.value);
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        type: "changeName",
        name: nameVal.value,
      };
      socket.send(JSON.stringify(paket));
    }
  });

nameVal.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    nameVal.blur();
    localStorage.setItem("playerName", nameVal.value);
    player.name = nameVal.value;
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        type: "changeName",
        name: nameVal.value,
      };
      socket.send(JSON.stringify(paket));
    }
  }
});
