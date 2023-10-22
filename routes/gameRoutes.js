import { Server } from "socket.io";

let _ioGameParty;

// const origin = "https://moneyballstore.webpubsub.azure.com";

const setIoGame = (server) => {
  _ioGameParty = new Server(server);

  return _ioGameParty;
};

const getIOGame = () => {
  return _ioGameParty;
};

export default {
  setIoGame,
  getIOGame,
};
