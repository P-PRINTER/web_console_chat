import { EventEmitter } from "events";
import { WebSocketServer } from "ws";

export function WSServer (config) {

    const serverEmitter = new EventEmitter();
    const server = new WebSocketServer(config);

    server.on("connection", socket => {
        const socketEmitter = new EventEmitter();
        
        const origOn = socketEmitter.on.bind(socketEmitter);
        const origEmit = socketEmitter.emit.bind(socketEmitter);

        socketEmitter.on = function (event, listener) {
            origOn(event, listener.bind(socket));
        };
        socketEmitter.emit = function (event, data) {
            socket.send(JSON.stringify({ event, data }));
        };
        socketEmitter.send = function (msg) { socket.send(msg) };

        serverEmitter.emit("connection", socketEmitter);

        socket.on("open", data => origEmit("open", data));
        socket.on("close", data => origEmit("close", data));
        socket.on("message", (msg) => {
            
            const origData = JSON.parse(msg);

            if (typeof origData !== "object" || !origData?.event) {
                origEmit("message", msg);
            }

            const { event, data } = origData;
            origEmit(event, data);
        });
    })

    return serverEmitter;
}
