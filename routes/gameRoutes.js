import { Server } from "socket.io";

let _ioSpareParty;
let _ioFastParty;
let _ioEasyParty;

const origin = "https://moneyballstore.azurewebsites.net/";

const setIoSpare = (server) => {
  _ioSpareParty = new Server(server, {
    path: "/clients/socketio/hubs/spare_hub",
  });

  return _ioSpareParty;
};

const setIoFast = (server) => {
  _ioFastParty = new Server(server, {
    path: "/clients/socketio/hubs/fast_hub",
  });

  return _ioFastParty;
};

const setIoEasy = (server) => {
  _ioEasyParty = new Server(server, {
    path: "/clients/socketio/hubs/easy_hub",
  });

  return _ioEasyParty;
};

const getIOSpare = () => {
  return _ioSpareParty;
};

const getIOFast = () => {
  return _ioFastParty;
};

const getIOEasy = () => {
  try {
    return _ioEasyParty;
  } catch (error) {
    console.log(error);
  }
};

export default {
  setIoSpare,
  setIoFast,
  setIoEasy,
  getIOSpare,
  getIOFast,
  getIOEasy,
};
