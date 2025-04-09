function WSClient (url) {
    const ws = new WebSocket(url);
    
    ws.addEventListener("message", function (evt) {
        const parsed = JSON.parse(evt.data);
        const event = {...evt};
        let eventName = "message";
        
        if (typeof parsed === "object" && parsed?.event) {
            eventName = parsed.event;
            event.data = parsed.data;
        }
        
        ws[`on${eventName}`]?.(event);
    });
    
    ws.emit = function(event, data) {
        ws.send(JSON.stringify({ event, data }));
    };
    
    return ws;
}
