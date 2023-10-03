import { Server } from "socket.io";

let _ioSpareParty;
let _ioFastParty;
let _ioEasyParty;

const setIoSpare = (server) => {
  _ioSpareParty = new Server(server, {
    path: "/api/v1/games/spareparty",
    cors: {
      origin: "http://localhost:5173", // Update this to match your client's URL
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

  return _ioSpareParty;
};

const setIoFast = (server) => {
  _ioFastParty = new Server(server, {
    path: "/api/v1/games/fastparty",
    cors: {
      origin: "http://localhost:5173", // Update this to match your client's URL
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

  return _ioFastParty;
};

const setIoEasy = (server) => {
  _ioEasyParty = new Server(server, {
    path: "/api/v1/games/easyparty",
    cors: {
      origin: "http://localhost:5173", // Update this to match your client's URL
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
