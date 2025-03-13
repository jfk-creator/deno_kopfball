let socket;
let server_addr = "ws://77.187.0.31:420";
let info = document.getElementById("info");
let id = -1
let maxConnection = 400;
let predict = true


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
    if(id === -1) {
      id = paket.id
      info.innerHTML += `you are Player${id}</br>`
      if(id > maxConnection) {
        info.innerHTML += 'closing Connection.</br>' 
        socket.close();
      }
    }
    gameState = paket.gs;
    predict = false
  });
  socket.addEventListener("close", () => {
    console.log("disconnected from server");
    info.innerHTML += `disconnected from server </br>`; 
  });
}

