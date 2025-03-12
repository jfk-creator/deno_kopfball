let socket;
let server_addr = "ws://77.179.182.49:420"
let info = document.getElementById("info");

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
    gameState = JSON.parse(event.data);
    console.log("server: ", gameState)
  });
  socket.addEventListener("close", () => {
    console.log("disconnected from server");
    info.innerHTML += `disconnected from server </br>`; 
  });
}

