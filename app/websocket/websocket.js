const webSocketsServerPort = 4001;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log("Server listen on " + webSocketsServerPort + " okay")
const wsServer = new webSocketServer({
    httpServer: server
});
// I'm maintaining all active connections in this object
const clients = [];
var mes = [{ id: 0, title: "YOLO" }];
// This code generates unique userid for everyuser.
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients.push({ id: userID, connection: connection });
    console.log('connected: ' + userID)

    connection.send(JSON.stringify({ what: 'lst', data: mes }));
    //connection.send(JSON.stringify({ what: 'info', data: info }));

    //let interval = setInterval(() => connection.send(JSON.stringify({ what: 'time', data: new Date().toString() })), 1000);

    JSON.stringify({ what: 'time', data: new Date })
    connection.on('message', function (message) {
        console.log('Received Message:', message.utf8Data);
        const json = JSON.parse(message.utf8Data.toString());
        var data;
        if (json.what === "lst") {
            mes = json.data;
            data = mes;
        } else if (json.what === "info") {
            mes = json.data;
            data = info;
        }
        clients.forEach(element => {
            console.log("Send User :" + element.id + "the Message")
            element.connection.send(JSON.stringify({ what: json.what, data: data }))
        });
    });
    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected.');
        //clearInterval(interval);
    });
});
