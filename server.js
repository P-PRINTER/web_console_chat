import { WSServer } from "./utils.js";
import http from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname + '/public';


const server = http.createServer((req, res) => {
    const filePath = req.url === '/' ? path.join(root, 'index.html') : path.join(root, req.url);
    fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
        return;
        }
        const ext = path.extname(filePath);
        const mimeType = ext === '.html' ? 'text/html' :
                        ext === '.js' ? 'application/javascript' :
                        ext === '.css' ? 'text/css' :
                        'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mimeType });
        fs.createReadStream(filePath).pipe(res);
    });
  });
const ws = new WSServer({ server });
const sockets = [];


ws.on("connection", function (socket) {
    const curId = sockets.push(socket) -1;

    for (let id in sockets) {
        if (sockets[id] === sockets[curId]) continue;
        //
        sockets[curId].emit("addpeer", {peer: id, offer: true});
        sockets[id].emit("addpeer", {peer: curId, offer: false});
    }

    socket.on("close", function () {
        delete sockets[curId];
        for (let id in sockets) sockets[id].emit("removepeer", {peer: curId});
    });

    socket.on("relaysdp", function ({ peer: target, data: sdp }) {
        sockets[target].emit("sdp", {peer: curId, data: sdp});
    });
    socket.on("relayice", function ({ peer: target, data: ice }) {
        sockets[target].emit("ice", {peer: curId, data: ice})
    });
})

server.listen(8080);