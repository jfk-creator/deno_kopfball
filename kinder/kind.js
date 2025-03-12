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
    let serverBall = data.ball
    ball.x = serverBall.x 
    ball.y = serverBall.y
    p1.x = data.p1.x
    // console.log((Date.now() - data.time));
  });
  socket.addEventListener("close", () => {
    console.log("disconnected from server");
    info.innerHTML += `disconnected to server </br>`; 
  });
}

function sendData(){
    let data = { text: "Hello from federball"};
    socket.send(JSON.stringify(data));
}
