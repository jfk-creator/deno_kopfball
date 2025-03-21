import p5 from "p5";
import { htmlObjects } from "./kopfball";
import { game, props } from "./types";
import { keyInput } from "./keyInput";
import { drawLevel } from "./drawLevel";

export function startGame() {
  new p5(sketch);
}

export let sprites: p5.Image[];

const sketch = (p5: p5) => {
  p5.preload = () => {
    sprites = [
      p5.loadImage("./assets/chonki_yellow.png"),
      p5.loadImage("./assets/chonki_orange.png"),
      p5.loadImage("./assets/chonki_blue.png"),
      p5.loadImage("./assets/chonki_green.png"),
      p5.loadImage("./assets/chonki_red.png"),
    ];
    htmlObjects.info.innerHTML += "assets loaded</br>";
  };

  p5.setup = () => {
    let canvas = p5.createCanvas(props.width, props.height);
    canvas.parent("theater");
  };

  p5.draw = () => {
    if (players.length > 0 && player && socket) {
      keyInput(p5, socket);
      switch (game.level) {
        case 1:
          if (game.drawLevel) drawLevel(p5, players);
          //   else drawShop();
          break;
        default:
          //   drawNirvana();
          break;
      }
      if (p5.frameCount % 60 == 0) {
        htmlObjects.playerInfo.innerHTML = "Players:</br>";
        for (const playerInst of players) {
          htmlObjects.playerInfo.innerHTML += `<span style="color:${playerInst.color}">${playerInst.name}: ${playerInst.ping}ms</span></br>`;
        }
      }
    }
  };
};
