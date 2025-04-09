const presentChat = once(_ => console.log("Chat is opened!"));

function P2P(config, ws) {
    const peer = new RTCPeerConnection(config);
    let chat;
    
    peer.onicecandidate = evt => {
        if (!evt.candidate) return;
        ws.emit("relayice", { peer: this.id, data: evt.candidate });
	};
	peer.ondatachannel = evt => setChat(evt.channel);
	
	Object.assign(this, {
	    genChat: () => setChat(peer.createDataChannel("Chat Channel")),
	    genOffer: () => {
	        peer.createOffer( offer => {
	            peer.setLocalDescription(offer);
	            ws.emit("relaysdp", { peer: this.id, data: offer });
	        }, _ => console.log("Fail to create offer.") );
	    },
	    chat: (name, msg) => {
	        chat?.send(JSON.stringify([name, msg]));
	    },
	    close: () => { peer.close() },
	});
	//
	Object.defineProperty(this, "offer", {
	    set (offer) {
	        peer.setRemoteDescription(offer);
	        peer.createAnswer(answer => {
	            peer.setLocalDescription(answer);
	            ws.emit("relaysdp", { peer: this.id, data: answer });
	        }, _ => console.log("Fail to create answer."));
	    }
	});
	Object.defineProperty(this, "answer", {
	    set (answer) { peer.setRemoteDescription(answer); }
	});
	Object.defineProperty(this, "candidate", {
	    set (candidate) {
	        if ( Array.isArray(candidate) ) {
                candidate.forEach(cand => {
                    if (cand.candidate?.candidate) peer.addIceCandidate( new RTCIceCandidate(cand) );
                });
                return;
            }
            peer.addIceCandidate( new RTCIceCandidate(candidate) );;
	    }
	});
	Object.defineProperty(this, "peer", {
	    get () { return peer; }
	});
	
	function setChat (channel) {
	    chat = channel;
	    chat.onopen = e => presentChat();
	    chat.onmessage = e => {
	        const [name, msg] = JSON.parse(e.data);
	        console.log(`${name}: ${msg}`);
	    };
	}
}

