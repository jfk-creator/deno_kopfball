import { Player, GameState } from "../../freunde/ts/types.ts";

export function saId(ids: number[]): number {
  for (let i = 0; i < ids.length; i++) {
    if (ids[i] === 0) {
      return i;
    }
  }
  return -1;
}

export function getPlayerId(players: Player[], key: number) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === key) {
      // if (debug) console.log(`found id: ${players[i].id} as: ${i}`);
      return i;
    }
  }
  return -1;
}

export function printPlayer(players: Player[]) {
  console.log("%cActive players: ", "color: green");
  for (const player of players) {
    console.log(`Id: ${player.id}, Name: ${player.name}, Ping: ${player.ping}`);
  }
}

export function deletePlayer(players: Player[], key: number) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].id === key) {
      players.splice(i, 1);
      console.log("Good bye player:", key);
      return players;
    }
  }
  return players;
}

export function broadcast(
  serverGameState: GameState,
  sockets: Map<number, WebSocket>
) {
  for (const [id, socket] of sockets.entries()) {
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        type: "gameState",
        id: id,
        players: serverGameState.players,
        ball: serverGameState.ball,
        nextPlayer: serverGameState.game.nextPlayer,
        score: serverGameState.game.score,
        level: serverGameState.game.level,
        drawLevel: serverGameState.game.drawLevel,
        itemLoadingBar: serverGameState.game.itemLoadingBar,
      };
      socket.send(JSON.stringify(paket));
      if (serverGameState.game.tick % serverGameState.props.frameRate == 0) {
        const pingPaket = {
          type: "ping",
          id: -1,
          pong: false,
          time: performance.now(),
        };
        socket.send(JSON.stringify(pingPaket));
      }
      if (serverGameState.game.tick % serverGameState.props.frameRate == 0) {
        const pingPaket = {
          type: "score",
          score: serverGameState.game.score,
        };
        socket.send(JSON.stringify(pingPaket));
      }
    }
  }
}
