import { Server } from "socket.io";

let _ioGameParty;

const origin =
  "http://localhost:5173/" || "https://moneyballstore.webpubsub.azure.com";

const setIoGame = (server) => {
  _ioGameParty = new Server(server, {
    path: "/clients/socketio/hubs/game_hub",
    cors: {
      origin: origin, // Update this to match your client's URL
      methods: ["GET", "POST"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
      ],
      credentials: true,
      optionSuccessStatus: 200,
    },
  });

  return _ioGameParty;
};

const getIOGame = () => {
  return _ioGameParty;
};

export default {
  setIoGame,
  getIOGame,
};
