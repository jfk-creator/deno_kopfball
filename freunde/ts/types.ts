export const game = {
  tick: 0,
  ids: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  level: 1,
  drawLevel: true,
  playerCount: 1,
  highscore: 0,
  score: 0,
  hits: 0,
  nextPlayer: 0,
};

export const props = {
  frameRate: 90,
  width: 960,
  height: 540,
  offset: 20,
};

export const ball = {
  posX: 460,
  posY: 20,
  velX: Math.random() * 8 - 4,
  velY: -2,
  gravity: 0.1,
  airDrag: 0.995,
  ballR: 8,
};

export const levelWins = [1000, 10000, 20000, 30000];

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
