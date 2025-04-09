const CONFIG = {
    iceServers: [
      // STUN серверы
      {
        urls: [
          "stun:stun.l.google.com:19302",  // STUN by Google
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:freeturn.net:3478",         // STUN by freeTURN
        ]
      },
      // TURN
      {
        urls: [
          "turn:turn.anyfirewall.com:3478?transport=udp",  // Public TURN by Turbosoft
          "turn:turn.l.google.com:19305?transport=udp",   // Public TURN by Google
          "turn:turn.l.google.com:19305?transport=tcp",   // Public TURN by Google through TCP
          "turn:openrelay.metered.ca:80?transport=udp",   // Public TURN by Open Relay Project
          // Public TURN by Open Relay Project
          "turn:turnserver.openrelayproject.org:3478?transport=udp",
        ],
        username: "free",         // for TURN
        credential: "free"       // for TURN
      }
    ]
  };

const HOST = "localhost:8080";
const SECURE = false;

const ws = new WSClient(`${SECURE ? 'wss' : 'ws'}://${HOST}`);
