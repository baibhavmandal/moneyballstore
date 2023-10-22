import { Server } from "socket.io";

let _ioGameParty;

const origin = "https://moneyballstore.webpubsub.azure.com";

const setIoGame = (server) => {
  _ioGameParty = new Server(server, {
    cors: {
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
