function level1() {
  background(20);
  drawNextPlayerCircle();
  drawText();
  for (let i = 0, k = 0; i < gameState.game.ids.length; i++) {
    if (gameState.game.ids[i] === 1) {
      let player = gameState.player[k++];
      drawPlayer(player);
    }
  }
  drawBall(gameState.ball);

  keyInput();
  gameState = importedModule.runPhysics(gameState);

  if (frameCount % 10 == 0) {
    playerInfo.innerHTML = "";
    for (let i = 0; i < gameState.player.length; i++) {
      let player = gameState.player[i];
      playerInfo.innerHTML += `<span style="color: ${player.color}">${player.id}. ${player.name}: ${player.ping}</span></br>`;
    }
  }
}
