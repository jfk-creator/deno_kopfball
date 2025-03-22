import { Player } from "../../freunde/ts/types.ts";

const colorArr = [
  "#FFA905", // Tokyo Red
  "#FF5400", // Tokyo Gold
  "#1ED1FF", // Tokyo Skyblue
  "#9DED00", // Tokyo Blue
  "#F10047", // Vivid Red-Orange
];
const germanNames: string[] = [
  "Hans",
  "Anna",
  "Lisa",
  "Frederike",
  "Ursula",
  "Günther",
  "Heidi",
  "Klaus",
  "Brigitte",
  "Wolfgang",
  "Christa",
];

export function getPlayerFromArr(key: number): Player {
  return {
    posX: 480,
    posY: 540,
    velX: Math.random() * 50 - 25,
    velY: 0,
    id: key,
    ping: 0,
    name: germanNames[Math.floor(Math.random() * germanNames.length)],
    color: colorArr[key % 5],
    playerWidth: 64,
    playerHeight: 64,
    playerOffset: 20,
    movementSpeed: 5,
    jumpSpeed: -3,
    dashSpeed: 15,
    resistance: 0.8999,
    gravity: 0.1,
    hitForce: 1.2,
    jumpCooldown: 0,
  };
}
