const peers = {};


let name = null;
function chat (msg) { console.log(`${name}: ${msg}`); for (let p in peers) peers[p].chat(name, msg); }


ws.onaddpeer = function (evt) {
    const {peer: peerId, offer: isOffer} = evt.data;
    peers[peerId] = new P2P(CONFIG, ws);
    peers[peerId].id = peerId;
    
    if (isOffer) {
        peers[peerId].genChat();
        peers[peerId].genOffer();
    }
};
ws.onremovepeer = function (evt) {
    const {peer: peerId } = evt.data;
    //
    peers[peerId].close();
    delete peers[peerId];
}

ws.onsdp = function (evt) {
    const { peer: peerId, data: sdp } = evt.data;
    //
    if (sdp.type === "offer")   peers[peerId].offer = sdp;
    else                        peers[peerId].answer = sdp;
}
ws.onice = function (evt) {
    const { peer: peerId, data: candidate } = evt.data;
    peers[peerId].candidate = candidate;
}
