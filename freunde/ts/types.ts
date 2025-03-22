export const game: Game = {
  tick: 0,
  ids: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  level: 1,
  drawLevel: true,
  playerCount: 1,
  highscore: 0,
  score: 0,
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
  gravity: 0.1,
  airDrag: 0.995,
  ballR: 30,
};

export const ballArr: Ball[] = [
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.1,
    airDrag: 0.995,
    ballR: 30,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.12,
    airDrag: 0.995,
    ballR: 25,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.16,
    airDrag: 0.995,
    ballR: 15,
  },
  {
    posX: 460,
    posY: 20,
    velX: Math.random() * 8 - 4,
    velY: -2,
    gravity: 0.2,
    airDrag: 0.995,
    ballR: 10,
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
];

export function resetBall(level: number): Ball {
  let ball = ballArr[level % ballArr.length];
  ball.posX = 460;
  ball.posY = 20;
  ball.velX = Math.random() * 8 - 4;

  return ball;
}

export const levelWins = [10000, 25000, 50000, 75000, 100000];

export interface Game {
  tick: number;
  ids: number[];
  level: number;
  drawLevel: boolean;
  playerCount: number;
  highscore: number;
  score: number;
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
