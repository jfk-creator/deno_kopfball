let socket;
let server_addr = "ws://127.0.0.1:420";
let info = document.getElementById("info");
let nameVal = document.getElementById("name");
let sendNameButton = document.getElementById("sendName");
let id = -1;
let maxConnection = 5;
let connectionInitialized = false;

function connectWebSocket() {
  socket = new WebSocket(server_addr);
  socket.addEventListener("open", () => {
    console.log("connected to server");
    info.innerHTML += `</br>connected to server </br>`;
  });
  handleConnection(socket);
}

function handleConnection(socket) {
  socket.addEventListener("message", (event) => {
    let paket = JSON.parse(event.data);
    if (paket.type == "init" && !connectionInitialized) {
      id = paket.id;
      info.innerHTML += `Hallo Freund ${id + 1}</br>`;
      connectionInitialized = true;
      if (id > maxConnection) {
        info.innerHTML += "closing Connection.</br>";
        socket.close();
        connectionInitialized = false;
      } else {
        const playerName = localStorage.getItem("playerName");
        if (playerName) {
          const paket = {
            type: "changeName",
            id: id,
            name: playerName,
          };
          socket.send(JSON.stringify(paket));
        }
      }
    }
    if (connectionInitialized) {
      if (paket.type == "gameState") {
        gameState = paket.gs;
      }
      if (paket.type == "ping") {
        if (!paket.pong) {
          paket.pong = true;
          paket.id = id;
          socket.send(JSON.stringify(paket));
        }
      }
    }
  });
  socket.addEventListener("close", () => {
    console.log("disconnected from server");
    info.innerHTML += `disconnected from server </br>`;
  });
}

sendNameButton.addEventListener("click", function () {
  gameState.player[0].name = nameVal.value;
  nameVal.blur();
  localStorage.setItem("playerName", nameVal.value);
  if (socket.readyState === WebSocket.OPEN) {
    const paket = {
      type: "changeName",
      id: id,
      name: nameVal.value,
    };
    socket.send(JSON.stringify(paket));
  }
});

nameVal.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    nameVal.blur();
    localStorage.setItem("playerName", nameVal.value);
    gameState.player[0].name = nameVal.value;
    if (socket.readyState === WebSocket.OPEN) {
      const paket = {
        type: "changeName",
        id: id,
        name: nameVal.value,
      };
      socket.send(JSON.stringify(paket));
    }
  }
});
