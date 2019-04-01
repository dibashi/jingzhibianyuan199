export default class NewWebSocket{
    constructor() {
        
    }
    ConnectSocket(host,port){
        let url = "ws://" + host + ":" + port//+ "/ws"
        //this.socket = new WebSocket("ws://echo.websocket.org");
        console.log(url)
        this.socket = new WebSocket(url);
        this.socket.onopen = function (event) {
            console.log("Send Text WS was opened.");
        };
        this.socket.onmessage = function (msg) {
            console.log("response text msg: ");
            console.log(msg)
            var data = JSON.parse(msg);
            console.log(data)
            //window.Notification.emit("server_respond_"+data.Id,data)
        };
        this.socket.onerror = function (event) {
            console.log("Send Text fired an error");
        };
        this.socket.onclose = function (event) {
            console.log("WebSocket instance closed.");
        };
        // setTimeout(function () {
        //     if (socket.readyState === WebSocket.OPEN) {
        //         socket.send("Hello WebSocket, I'm a text message.");
        //     }
        //     else {
        //         console.log("WebSocket instance wasn't ready...");
        //     }
        // }, 3);
        
    }
    SendSocket(msg){
        console.log(">"+msg)
        this.socket.send(JSON.stringify(msg))
    }
}