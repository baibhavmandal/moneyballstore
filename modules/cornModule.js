import { ColorPredictionGame, QuizGame } from "./gameModule.js";
import {
  getColorsSpareParity,
  getColorsFastParity,
  getNumbersSpareParity,
  getNumbersFastParity,
  getSpareParityUserDetails,
  getFastParityUserDetails,
  getEasyParityUserDetails,
  initializeSpareParityUserDetails,
  initializeFastParityUserDetails,
  initializeEasyParityUserDetails,
  getExpression,
  updateExpression,
} from "../config/data.js";
import gameRoutes from "../routes/gameRoutes.js";
import { initializeArraysToZero } from "../config/data.js";
import { getPeriodById } from "./dbModule.js";

const spareParityGame = new ColorPredictionGame();
const fastParityGame = new ColorPredictionGame();
const easyParityGame = new QuizGame();

// Function to handle the event before initializeArraysToZero
function handleEventBeforeInitialize(gameName) {
  return new Promise((resolve, reject) => {
    try {
      // Perform your logic here
      console.log(
        "Event before initializeArraysToZero executed at:",
        new Date()
      );

      let gameResult;

      if (gameName === "spareParity") {
        gameResult = spareParityGame.result(
          getColorsSpareParity(),
          getNumbersSpareParity()
        );

        const getUserDetails = getSpareParityUserDetails();
        spareParityGame.updateOrdersForAllUsers(gameResult, getUserDetails);
        spareParityGame.calculateProfitLossForUsers(gameResult, getUserDetails);
      } else if (gameName === "fastParity") {
        console.log(getColorsFastParity(), getNumbersFastParity());
        gameResult = fastParityGame.result(
          getColorsFastParity(),
          getNumbersFastParity()
        );

        const getUserDetails = getFastParityUserDetails();
        fastParityGame.updateOrdersForAllUsers(gameResult, getUserDetails);
        fastParityGame.calculateProfitLossForUsers(gameResult, getUserDetails);
      } else {
        const expression = getExpression();
        gameResult = easyParityGame.getColorFromExpression(expression);
        const getUserDetails = getEasyParityUserDetails();
        easyParityGame.updateOrdersForAllUsers(gameResult, getUserDetails);
        easyParityGame.calculateProfitLossForUsers(gameResult, getUserDetails);
      }

      // Resolve the promise to continue with the next event
      resolve(gameResult);
    } catch (error) {
      // Reject the promise with a meaningful error message
      reject(`Error in handleEventBeforeInitialize: ${error}`);
    }
  });
}

// Function to handle the event after initializeArraysToZero
async function handleEventAfterInitialize(
  gameName,
  namespace,
  gameResult,
  periodId
) {
  try {
    console.log("Event after initializeArraysToZero executed at:", new Date());

    // Emit the "reset" message to the client
    initializeArraysToZero(gameName);
    if (gameName == "spareParity") {
      const count = await getPeriodById(periodId);
      namespace.emit("reset", gameResult, count);
      initializeSpareParityUserDetails();
    } else if (gameName == "fastParity") {
      const count = await getPeriodById(periodId);
      namespace.emit("reset", gameResult, count);
      initializeFastParityUserDetails();
    } else {
      const expression = easyParityGame.generateRandomExpression();
      const count = await getPeriodById(periodId);
      namespace.emit("reset", expression, gameResult, count);
      updateExpression(expression);
      initializeEasyParityUserDetails();
    }
  } catch (error) {
    console.error("Error in handleEventAfterInitialize:", error);
  }
}

export { handleEventBeforeInitialize, handleEventAfterInitialize };
