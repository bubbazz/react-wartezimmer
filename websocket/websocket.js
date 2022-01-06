const webSocketsServerPort = 4000;
const webSocketsServerHostname = '0.0.0.0';
const webSocketServer = require('websocket').server;
const fs = require('fs');
const http = require('http');
// Spinning the http server and the websocket server.
const server = http.createServer();
http.createServer(function (req, res) {
    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
}).listen(8000);
server.listen(webSocketsServerPort, webSocketsServerHostname, () => {
    console.log('server lisen on http://' + webSocketsServerHostname + ":" + webSocketsServerPort)
});
const wsServer = new webSocketServer({
    httpServer: server
});
// I'm maintaining all active connections in this object
const clients = [];
var mes = [{ id: 0, title: "Server verbunden" }];
var infotop = "TopInfo konnte nicht gelesen werden";
var infobot = "BotInfo konnte nicht gelesen werden";

// This code generates unique userid for everyuser.
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};
const JsonSend = (con, what, data) => {
    con.send(JSON.stringify({ what: what, data: data }));
};
const WriteFile = (path, data,) => {
    fs.writeFile("data/infotop.txt", infotop, (e) => {
        if (e != null) {
            console.log("Ein Fehler ist auf getretten:")
            console.log(e)
        }
    })
};
const ReadFile = (path, con, what) => {
    fs.readFile(path, "utf8", (err, filecontent) => {
        console.log("reading Data " + path);
        JsonSend(con, what, filecontent)
    });
};

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients.push({ id: userID, connection: connection });
    console.log('connected: ' + userID)

    JsonSend(connection, 'lst', mes);
    ReadFile("data/infotop.txt", connection, "infotop");
    ReadFile("data/infobot.txt", connection, "infobot");

    //let interval = setInterval(() => connection.send(JSON.stringify({ what: 'time', data: new Date().toString() })), 1000);
    //JSON.stringify({ what: 'time', data: new Date() })

    connection.on('message', function (message) {
        console.log('Received Message:', message.utf8Data);
        const json = JSON.parse(message.utf8Data.toString());
        var data;
        if (json.what === "lst") {
            mes = json.data;
            data = mes;
        } else if (json.what === "infotop") {
            infotop = json.data;
            WriteFile("data/infotop.txt", infotop,)
            data = infotop;
        } else if (json.what === "infobot") {
            infobot = json.data;
            fs.writeFile("data/infobot.txt", infobot, (e) => console.log(e));
            data = infobot;
        }
        clients.forEach(element => {
            console.log("Send User :" + element.id + "the Message")
            JsonSend(element.connection, json.what, data);
        });
    });
    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected.');
        clients.forEach((c, index) => {
            if (c.id === userID && index >= 0 && index <= clients.length)
                clients.splice(index, 1)
        });
        //clearInterval(interval);
    });
});