export const port = 42069;
// export const host = "85.215.131.226"; // IONOS
export const host = "127.0.0.1"; // HOME

export const game: Game = {
  tick: 0,
  ids: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  level: 1,
  drawLevel: true,
  playerCount: 1,
  highscore: 0,
  bestHit: 0,
  score: 0,
  scoreCounter: 0,
  hits: 0,
  nextPlayer: 0,
  itemLoadingBar: [0, 0, 0],
};

export const props: Props = {
  frameRate: 90,
  width: 960,
  height: 540,
  offset: 20,
};

export const ball: Ball = {
  posX: 460,
  posY: 20,
  velX: Math.random() * 8 - 4,
  velY: -2,
  gravity: 0.05,
  airDrag: 0.995,
  ballR: 40,
  ballSpeed: 0,
};

export const ballArr: Ball[] = [
  ball,
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.075,
    airDrag: 0.995,
    ballR: 35,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.1,
    airDrag: 0.995,
    ballR: 32,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.125,
    airDrag: 0.995,
    ballR: 30,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.15,
    airDrag: 0.995,
    ballR: 27,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.16,
    airDrag: 0.995,
    ballR: 25,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.17,
    airDrag: 0.995,
    ballR: 22,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.18,
    airDrag: 0.995,
    ballR: 20,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.2,
    airDrag: 0.995,
    ballR: 18,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.22,
    airDrag: 0.995,
    ballR: 15,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.24,
    airDrag: 0.995,
    ballR: 12,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.26,
    airDrag: 0.995,
    ballR: 10,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.28,
    airDrag: 0.995,
    ballR: 8,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.3,
    airDrag: 0.995,
    ballR: 5,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.4,
    airDrag: 0.995,
    ballR: 4,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.4,
    airDrag: 0.993,
    ballR: 3,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.4,
    airDrag: 0.991,
    ballR: 3,
  },
];

export function resetBall(level: number): Ball {
  let ball = ballArr[level % ballArr.length];
  ball.posX = 460;
  ball.posY = 20;
  ball.velX = Math.random() * 8 - 4;

  return ball;
}

export const levelWins = [
  20000, 30000, 35000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 100000,
  100000, 100000, 100000, 100000, 100000,
];

export interface Game {
  tick: number;
  ids: number[];
  level: number;
  drawLevel: boolean;
  playerCount: number;
  highscore: number;
  bestHit: number;
  score: number;
  scoreCounter: number;
  hits: number;
  nextPlayer: number;
  itemLoadingBar: number[];
}

export interface Props {
  frameRate: number;
  width: number;
  height: number;
  offset: number;
}

export interface Ball {
  posX: number;
  posY: number;
  velX: number;
  velY: number;
  gravity: number;
  airDrag: number;
  ballR: number;
  ballSpeed: number;
}

export interface Player {
  posX: number;
  posY: number;
  velX: number;
  velY: number;
  id: number;
  ping: number;
  name: string;
  color: string;
  playerWidth: number;
  playerHeight: number;
  playerOffset: number;
  movementSpeed: number;
  jumpSpeed: number;
  dashSpeed: number;
  resistance: number;
  gravity: number;
  hitForce: number;
  jumpCooldown: number;
}

export interface GameState {
  props: Props;
  game: Game;
  players: Player[];
  ball: Ball;
  levelWins: number[];
}

export interface pingPakete {
  type: string;
  id: number;
  pong: boolean;
  time: number;
}

export const hans: Player = {
  posX: 480,
  posY: 540,
  velX: Math.random() * 50 - 25,
  velY: 0,
  id: 0,
  ping: 0,
  name: "Hans",
  color: "#FFA905",
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

export const laura: Player = {
  posX: 480,
  posY: 540,
  velX: Math.random() * 50 - 25,
  velY: 0,
  id: 1,
  ping: 0,
  name: "Laura",
  color: "#FF5400",
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
