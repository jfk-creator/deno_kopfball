import { connectWebSocket } from "./client";
import { startGame } from "./game";
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
  globalThis.server_addr = "ws://192.168.178.22:420";
  if (playerName) localData.localPlayerName = playerName;
  if (highscore) localData.localHighscore = parseFloat(highscore);
}

init();
connectWebSocket();
startGame();
