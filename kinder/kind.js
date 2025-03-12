let socket;
let info = document.getElementById("info");

function connectWebSocket() {
  socket = new WebSocket("ws://77.179.182.49:420");
  socket.addEventListener("open", () => {
    console.log("connected to server"); 
    info.innerHTML += `</br>connected to server </br>`;  
  });
  handleConnection(socket);
}


function handleConnection(socket) {
  socket.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
    ball.x = data.x 
    ball.y = data.y
    console.log("message: ", data) 
  });
  socket.addEventListener("close", () => {
    console.log("disconnected from server");
    info.innerHTML += `disconnected to server </br>`; 
  });
}

function sendData(){
    let data = { text: "Hello from federball"};
    socket.send(JSON.stringify(data));
    console.log("send msg: ", data);
}
