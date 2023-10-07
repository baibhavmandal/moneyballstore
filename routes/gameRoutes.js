import { Server } from "socket.io";

let _ioSpareParty;
let _ioFastParty;
let _ioEasyParty;

const setIoSpare = () => {
  _ioSpareParty = new Server(3000);

  return _ioSpareParty;
};

const setIoFast = () => {
  _ioFastParty = new Server(3000);

  return _ioFastParty;
};

const setIoEasy = () => {
  _ioEasyParty = new Server(3000);

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
