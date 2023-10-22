import {
  updateColorsParity,
  updateNumbersParity,
  updateSpareParityUserDetails,
  updateFastParityUserDetails,
  updateEasyParityUserDetails,
  getExpression,
} from "../config/data.js";
import { getPeriodById } from "../modules/dbModule.js";

// To send client current time interval
function timeUntilNextMultiple(interval) {
  const currentSecond = new Date().getSeconds();
  const intervalMod = interval - (currentSecond % interval);

  if (intervalMod === 0) {
    return interval;
  } else {
    return intervalMod;
  }
}

function timeUntilNext3MinuteInterval() {
  const now = new Date();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  const interval = 3 * 60; // 3 minutes in seconds
  const totalSeconds = currentMinutes * 60 + currentSeconds;
  const intervalMod = interval - (totalSeconds % interval);

  // Calculate the time remaining in seconds until the next 3-minute interval
  return intervalMod;
}

const gameParity = async (socket) => {
  console.log("A user connected to the game");
};

const spareParity = async (socket) => {
  console.log("SpareParty: A user connected");

  // Your SpareParty-specific event handling
  const periodId = "6502c66ff3c8210a9981a723";
  const secondMod180 = timeUntilNext3MinuteInterval();
  const count = await getPeriodById(periodId);

  socket.emit("secondMod180", secondMod180, count);

  socket.on("sendButtonResponses", async (buttonResponses) => {
    // console.log("Received responses from client:", buttonResponses);

    // Update colorsSpareParity and numberSpareParity
    updateColorsParity(buttonResponses, "spareParity");
    updateNumbersParity(buttonResponses, "spareParity");

    updateSpareParityUserDetails(buttonResponses.userId, buttonResponses);

    socket.emit("responsesReceived", "Responses received successfully");
  });

  socket.on("disconnect", () => {
    console.log("SpareParty: A user disconnected");
  });
};

// Define fastParity function
const fastParity = async (socket) => {
  console.log("FastParty: A user connected");

  // Your FastParty-specific event handling
  const periodId = "6502c686f3c8210a9981a728";
  const secondMod30 = timeUntilNextMultiple(30);
  const count = await getPeriodById(periodId);

  socket.emit("secondMod30", secondMod30, count);

  socket.on("sendButtonResponses", async (buttonResponses) => {
    console.log("Received responses from client:", buttonResponses);

    // Update colorsFastParity and numbersFastParity
    updateColorsParity(buttonResponses, "fastParity");
    updateNumbersParity(buttonResponses, "fastParity");

    updateFastParityUserDetails(buttonResponses.userId, buttonResponses);

    socket.emit("responsesReceived", "Responses received successfully");
  });

  socket.on("disconnect", () => {
    console.log("FastParty: A user disconnected");
  });
};

// Easy Parity Code
const easyParity = async (socket) => {
  console.log("EasyParty: A user connected");

  const periodId = "6502c6a4f3c8210a9981a72a";
  const expression = getExpression();
  const secondMod20 = timeUntilNextMultiple(30);
  const count = await getPeriodById(periodId);

  // Send an initial response when the client connects
  socket.emit("initialResponse", secondMod20, expression, count);

  // Handle button click and store responses
  socket.on("buttonClick", async (buttonResponse) => {
    if (buttonResponse.participatedInColorPrediction)
      updateEasyParityUserDetails(buttonResponse.userId, buttonResponse);

    socket.emit("responsesReceived", "Responses received successfully");
  });

  socket.on("disconnect", () => {
    console.log("EasyParty: A user disconnected");
  });
};

export { gameParity, spareParity, fastParity, easyParity };
