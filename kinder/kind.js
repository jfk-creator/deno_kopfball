let socket;
let server_addr = "ws://77.179.182.49:420"
let info = document.getElementById("info");
let id = -1


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
    if(id === -1) id = paket.id
    if(id > 2) console.error("I'm the third wheel of a bicycle :/")
      console.log("i am player", id)
    gameState = paket.gs;
  });
  socket.addEventListener("close", () => {
    console.log("disconnected from server");
    info.innerHTML += `disconnected from server </br>`; 
  });
}

