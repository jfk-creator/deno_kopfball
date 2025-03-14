let socket;
let server_addr = "ws://93.130.199.120:420";
let info = document.getElementById("info");
let id = -1
let maxConnection = 400;
let connectionInitialized = false


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
    if(paket.type == "init" && !connectionInitialized) {
      id = paket.id
      info.innerHTML += `you are Player${id+1}</br>`
      connectionInitialized = true;
      if(id > maxConnection) {
        info.innerHTML += 'closing Connection.</br>' 
        socket.close();
        connectionInitialized = false;
      }
    }
    if(connectionInitialized){
      if(paket.type == "gameState"){
        gameState = paket.gs;
      }
      if(paket.type == "ping"){
        if(!paket.pong){
          paket.pong = true;
          paket.id = id
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

