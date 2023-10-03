// Initialize arrays for tracking user choices for a game
const colorsSpareParity = [0, 0, 0];
const colorsFastParity = [0, 0, 0];
const numbersSpareParity = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const numbersFastParity = [0, 0, 0, 0, 0, 0, 0, 0, 0];

// store userId and OTP as key value player.
const otpStore = new Map();
const adminOTP = new Map();

// store response from users who have participated in game
let spareParityUserDetails = {};
let fastParityUserDetails = {};
let easyParityUserDetails = {};

// Store game result latest 40 games
const fastParityLimitedCapacityArray = [];
const fastParityLimitedCapacity = 30;
const spareParityLimitedCapacityArray = [];
const spareParityLimitedCapacity = 30;

// Store expression for each quize game
let expression = "";

// Function to update the expression
function updateExpression(newExpression) {
  expression = newExpression;
}

// Function to get the expression
function getExpression() {
  return expression;
}

// Function to update user details and responses for spareParity
function updateSpareParityUserDetails(userId, response) {
  // Check if the user ID exists in spareParityUserDetails
  spareParityUserDetails[userId] = {
    responses: [],
  };

  // Add the response to the user's list of responses for spareParity
  spareParityUserDetails[userId].responses.push(response);
}

// Function to update user details and responses for fastParity
function updateFastParityUserDetails(userId, response) {
  fastParityUserDetails[userId] = {
    responses: [],
  };

  // Add the response to the user's list of responses for fastParity
  fastParityUserDetails[userId].responses.push(response);
}

// Function to update user details and responses for easyParity
function updateEasyParityUserDetails(userId, response) {
  // Check if the user ID exists in easyParityUserDetails
  if (!easyParityUserDetails[userId]) {
    easyParityUserDetails[userId] = {
      responses: [],
    };
  }

  // Add the response to the user's list of responses for easyParity
  easyParityUserDetails[userId].responses.push(response);
}

// Function to get user details and responses for spareParity
function getSpareParityUserDetails() {
  return spareParityUserDetails || null;
}

// Function to get user details and responses for fastParity
function getFastParityUserDetails() {
  return fastParityUserDetails || null;
}

// Function to get user details and responses for easyParity

function getEasyParityUserDetails() {
  return easyParityUserDetails || null;
}

function initializeSpareParityUserDetails() {
  spareParityUserDetails = {};
}

// Function to get user details and responses for easyParity
function initializeFastParityUserDetails() {
  fastParityUserDetails = {};
}

// Function to get user details and responses for easyParity
function initializeEasyParityUserDetails() {
  easyParityUserDetails = {};
}

// Separate function to update colorsParity
function updateColorsParity(response, gameName) {
  if (!response.participatedInColorPrediction) {
    return; // The client didn't participate in the game, so no update is needed.
  }

  const { colorPredictionInfo } = response;
  const { colorBets } = colorPredictionInfo;

  const colorParityMap = {
    spareParity: colorsSpareParity,
    fastParity: colorsFastParity,
  };

  const colorsToUpdate = colorParityMap[gameName];

  if (!colorsToUpdate) {
    return; // Invalid game name, no update can be performed.
  }

  // Update colorsParity based on the total betted amount
  for (const colorBet of colorBets) {
    const { color, amountBetted, totalBetsOnColor } = colorBet;
    const index = getColorIndex(color);

    if (index !== -1) {
      colorsToUpdate[index] += amountBetted * totalBetsOnColor;
    }
  }
}

// Get color index
function getColorIndex(color) {
  const colorMap = {
    red: 0,
    green: 1,
    violet: 2,
  };

  return colorMap[color] !== undefined ? colorMap[color] : -1;
}

// Separate function to update numbersParity
function updateNumbersParity(response, gameName) {
  if (!response.participatedInColorPrediction) {
    return; // The client didn't participate in the game, so no update is needed.
  }

  const { colorPredictionInfo } = response;
  const { numberBets } = colorPredictionInfo;

  const numbersParityMap = {
    spareParity: numbersSpareParity,
    fastParity: numbersFastParity,
  };

  const numbersToUpdate = numbersParityMap[gameName];

  if (!numbersToUpdate) {
    return; // Invalid game name, no update can be performed.
  }

  // Update numbersParity based on the total betted amount
  for (const numberBet of numberBets) {
    const { number, amountBetted, totalBetsOnNumber } = numberBet;
    const numberIndex = number - 1; // Adjust for 0-based index

    if (numberIndex >= 0 && numberIndex < numbersToUpdate.length) {
      numbersToUpdate[numberIndex] += amountBetted * totalBetsOnNumber;
    }
  }
}

// Initialize numbersparity and colorsparity
function initializeArraysToZero(gameName) {
  if (gameName == "spareParity") {
    colorsSpareParity.fill(0);
    numbersSpareParity.fill(0);
  }

  if (gameName == "fastParity") {
    colorsFastParity.fill(0);
    numbersFastParity.fill(0);
  }
}

function getColorsSpareParity() {
  return colorsSpareParity;
}

function getColorsFastParity() {
  return colorsFastParity;
}

function getNumbersSpareParity() {
  return numbersSpareParity;
}

function getNumbersFastParity() {
  return numbersFastParity;
}

const updateOtpInStore = (key, newValue) => {
  otpStore.set(key, newValue);
};

const deleteOtpFromStore = (key) => {
  otpStore.delete(key);
};

const getOtpFromStore = (key) => {
  return otpStore.get(key);
};

function updateAdminOTP(mobileNumber, newOTP) {
  adminOTP.set(mobileNumber, newOTP);
}

function deleteAdminOTP(mobileNumber) {
  adminOTP.delete(mobileNumber);
}

function getAdminOTP(mobileNumber) {
  return adminOTP.get(mobileNumber);
}

function pushSpareLimitedCapacityArray(item) {
  spareParityLimitedCapacityArray.push(item);
  if (spareParityLimitedCapacityArray.length > spareParityLimitedCapacity) {
    // If the data size exceeds the capacity, remove the oldest 10 values
    spareParityLimitedCapacityArray.splice(
      0,
      Math.max(
        spareParityLimitedCapacityArray.length - spareParityLimitedCapacity,
        10
      )
    );
  }
}

function getSpareLimitedCapacityArray() {
  return [...spareParityLimitedCapacityArray]; // Return a copy of the fastParityLimitedCapacityArray array
}

function pushFastLimitedCapacityArray(item) {
  fastParityLimitedCapacityArray.push(item);
  if (fastParityLimitedCapacityArray.length > fastParityLimitedCapacity) {
    // If the data size exceeds the capacity, remove the oldest 10 values
    fastParityLimitedCapacityArray.splice(
      0,
      Math.max(
        fastParityLimitedCapacityArray.length - fastParityLimitedCapacity,
        10
      )
    );
  }
}

function getFastLimitedCapacityArray() {
  return [...fastParityLimitedCapacityArray]; // Return a copy of the data array
}

export {
  updateSpareParityUserDetails,
  updateFastParityUserDetails,
  getSpareParityUserDetails,
  getFastParityUserDetails,
  initializeSpareParityUserDetails,
  initializeFastParityUserDetails,
  initializeEasyParityUserDetails,
  updateColorsParity,
  updateNumbersParity,
  initializeArraysToZero,
  getColorsSpareParity,
  getColorsFastParity,
  getNumbersSpareParity,
  getNumbersFastParity,
  updateOtpInStore,
  deleteOtpFromStore,
  getOtpFromStore,
  updateAdminOTP,
  deleteAdminOTP,
  getAdminOTP,
  pushSpareLimitedCapacityArray,
  pushFastLimitedCapacityArray,
  getSpareLimitedCapacityArray,
  getFastLimitedCapacityArray,
  updateEasyParityUserDetails,
  getEasyParityUserDetails,
  updateExpression,
  getExpression,
};
