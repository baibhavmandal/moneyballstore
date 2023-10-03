import {
  updateUserBalance,
  updateUserBets,
  addOrdersToDatabase,
  addOrdersToUser,
} from "./dbModule.js";

class Game {
  constructor() {}

  getRandomSample(array, size) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, size);
  }
}

class ColorPredictionGame extends Game {
  constructor() {
    super();
  }

  colorPrediction(colors) {
    const areAllZero = colors.every((value) => value === 0);

    if (areAllZero) {
      const colors = ["red", "green"];
      const randomColorIndex = Math.floor(Math.random() * colors.length);
      const randomColor = colors[randomColorIndex];

      return randomColor;
    }
    const R = 2 * colors[0];
    const G = 2 * colors[1];
    const VR = 4 * colors[2] + colors[0] / 2;
    const VG = 4 * colors[2] + colors[1] / 2;

    const minColor = Math.min(R, G, VG, VR);

    if (minColor === R) {
      return "red";
    } else if (minColor === G) {
      return "green";
    } else if (minColor === VG) {
      return "violet-green";
    } else {
      return "violet-red";
    }
  }

  numberPrediction(selectedColor, number) {
    const areAllZero = number.every((value) => value === 0);
    if (areAllZero) {
      if (selectedColor === "red") {
        const redNumbers = [2, 4, 6, 8];
        const randomIndex = Math.floor(Math.random() * redNumbers.length);
        const randomNumber = redNumbers[randomIndex];

        return randomNumber;
      } else if (selectedColor === "green") {
        const greenNumbers = [1, 3, 7, 9];
        const randomIndex = Math.floor(Math.random() * greenNumbers.length);
        const randomNumber = greenNumbers[randomIndex];

        return randomNumber;
      } else if (
        selectedColor === "violet-red" ||
        selectedColor === "violet-green"
      ) {
        const greenNumbers = [0, 5];
        const randomIndex = Math.floor(Math.random() * greenNumbers.length);
        const randomNumber = greenNumbers[randomIndex];

        return randomNumber;
      }
    }

    let minNumbers = [];

    if (selectedColor === "violet-red" || selectedColor === "violet-green") {
      minNumbers.push(number[0], number[5]);
    } else if (selectedColor === "green") {
      for (let i = 1; i <= 9; i += 2) {
        if (i === 5) continue;

        minNumbers.push(number[i]);
      }
    } else if (selectedColor === "red") {
      for (let i = 2; i <= 8; i += 2) {
        minNumbers.push(number[i]);
      }
    }

    return Math.min(...minNumbers);
  }

  result(colors, number) {
    const colorResult = this.colorPrediction(colors);
    const numberResult = this.numberPrediction(colorResult, number);

    console.log(colorResult, numberResult);
    return [colorResult, numberResult];
  }

  // function to calculate profit or loss
  calculateProfitLoss(buttonResponse, gameResult) {
    if (!buttonResponse || !buttonResponse.participatedInColorPrediction) {
      return 0; // The client didn't participate in the game, so no profit or loss.
    }

    const { colorPredictionInfo } = buttonResponse;
    const { colorBets, numberBets } = colorPredictionInfo;

    const colorResult = gameResult[0]; // Assuming gameResult is an array [colorResult, numberResult]
    const numberResult = gameResult[1];

    let profitLoss = 0;

    // Calculate profit/loss for color bets
    for (const colorBet of colorBets) {
      if (colorResult === "violet-red") {
        if (colorBet.color === "violet") {
          profitLoss += colorBet.amountBetted * colorBet.totalBetsOnColor * 4.5;
        } else if (colorBet.color === "red") {
          profitLoss += colorBet.amountBetted * colorBet.totalBetsOnColor * 0.5;
        } else {
          profitLoss -= colorBet.amountBetted * colorBet.totalBetsOnColor;
        }
      } else if (colorResult === "violet-green") {
        if (colorBet.color === "violet") {
          profitLoss += colorBet.amountBetted * colorBet.totalBetsOnColor * 4.5;
        } else if (colorBet.color === "green") {
          profitLoss += colorBet.amountBetted * colorBet.totalBetsOnColor * 0.5;
        } else {
          profitLoss -= colorBet.amountBetted * colorBet.totalBetsOnColor;
        }
      } else if (colorBet.color === colorResult) {
        profitLoss += colorBet.amountBetted * colorBet.totalBetsOnColor;
      } else {
        profitLoss -= colorBet.amountBetted * colorBet.totalBetsOnColor;
      }
    }

    // Calculate profit/loss for number bets
    for (const numberBet of numberBets) {
      if (numberBet.number === numberResult) {
        profitLoss += numberBet.amountBetted * numberBet.totalBetsOnNumber * 9;
      } else {
        profitLoss -= numberBet.amountBetted * numberBet.totalBetsOnNumber;
      }
    }

    console.log(profitLoss);

    return profitLoss;
  }

  // Function to calculate profit or loss for each user and update the balance of each user
  calculateProfitLossForUsers(gameResult, getUserDetails) {
    if (!getUserDetails) return 0;

    const users = Object.keys(getUserDetails);

    for (const userId of users) {
      const userResponses = getUserDetails[userId];
      const userResponseArray = userResponses.responses;
      for (const userResponse of userResponseArray) {
        const profitLoss = this.calculateProfitLoss(userResponse, gameResult);

        // Update user balance
        if (userResponse.participatedInColorPrediction) {
          updateUserBalance(userId, profitLoss);
          updateUserBets(userId, 1);
        }
      }
    }
  }

  generateOrders(userId, gameType, profiLoss, buttonResponse, gameResults) {
    if (!buttonResponse || !buttonResponse.participatedInColorPrediction) {
      return 0; // The client didn't participate in the game, so no profit or loss.
    }
    const orders = [];

    const { period, colorPredictionInfo } = buttonResponse;

    // Create order objects for color bets
    for (const colorBet of colorPredictionInfo.colorBets) {
      const order = {
        userId: userId,
        period: period,
        game: gameType,
        select: colorBet.color,
        betamount: colorBet.amountBetted * colorBet.totalBetsOnColor,
        results: gameResults, // Store the result as an array
        profitLoss: profiLoss,
      };
      orders.push(order);
    }

    // Create order objects for number bets
    for (const numberBet of colorPredictionInfo.numberBets) {
      const order = {
        userId: userId,
        period: period,
        game: gameType,
        select: numberBet.number.toString(),
        betamount: numberBet.amountBetted * numberBet.totalBetsOnNumber,
        results: gameResults, // Store the result as an array
        profitLoss: profiLoss,
      };
      orders.push(order);
    }

    return orders;
  }

  updateOrdersForAllUsers(gameResults, getUserDetails) {
    if (!getUserDetails) return 0;

    const users = Object.keys(getUserDetails);
    for (const userId of users) {
      const userResponses = getUserDetails[userId];
      const userResponseArray = userResponses.responses;
      for (const userResponse of userResponseArray) {
        const profitLoss = this.calculateProfitLoss(userResponse, gameResults);
        const orders = this.generateOrders(
          userId,
          "colorprediction",
          profitLoss,
          userResponse,
          gameResults
        );

        // Update user orders
        if (userResponse.participatedInColorPrediction) {
          addOrdersToUser(userId, orders);
          addOrdersToDatabase(orders);
        }
      }
    }
  }
}
class QuizGame extends Game {
  constructor() {
    super();
  }

  generateRandomExpression() {
    const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const signs = ["+", "-", "*", "/"];

    while (true) {
      const selectedValues = this.getRandomSample(values, 4);
      const selectedSigns = this.getRandomSample(signs, 3);

      const expression = `(${selectedValues[0]} ${selectedSigns[0]} ${selectedValues[1]}) ${selectedSigns[1]} ${selectedValues[2]} ${selectedSigns[2]} ${selectedValues[3]}`;

      const actualResult = eval(expression);

      if (
        actualResult >= 0 &&
        actualResult <= 9 &&
        Math.floor(actualResult) === actualResult
      ) {
        return expression;
      }
    }
  }

  getColorFromExpression(expression) {
    const actualResult = eval(expression);

    // Check if the actualResult is in the Red array
    if ([2, 4, 6, 8].includes(actualResult)) {
      return "red";
    }

    // Check if the actualResult is in the Green array
    if ([1, 3, 7, 9].includes(actualResult)) {
      return "green";
    }

    // Check if the actualResult is in the Violet array
    if ([0, 5].includes(actualResult)) {
      return "violet";
    }
  }

  calculateProfitLoss(buttonResponse, gameResult) {
    if (!buttonResponse.participatedInColorPrediction) return 0;

    const { colorPredictionInfo } = buttonResponse;
    const { colorBets } = colorPredictionInfo;
    const color = gameResult;

    let result = 0; // Initialize a variable to accumulate profit/loss

    for (const colorBet of colorBets) {
      if (color === colorBet.color) {
        // User won, calculate profit (10% of amount betted)
        const profit =
          0.1 * (colorBet.amountBetted * colorBet.totalBetsOnColor);
        result += profit; // Add profit to the result
      } else {
        // User lost, calculate loss (amount betted)
        const loss = colorBet.amountBetted * colorBet.totalBetsOnColor;
        result -= loss; // Subtract loss from the result
      }
    }

    return result; // Return the accumulated profit/loss
  }

  // Function to calculate profit or loss for each user and update the balance of each user
  calculateProfitLossForUsers(gameResult, getUserDetails) {
    if (!getUserDetails) return 0;

    const users = Object.keys(getUserDetails);

    for (const userId of users) {
      const userResponses = getUserDetails[userId];
      const userResponseArray = userResponses.responses;
      for (const userResponse of userResponseArray) {
        const profitLoss = this.calculateProfitLoss(userResponse, gameResult);

        // Update user balance
        if (userResponse.participatedInColorPrediction) {
          updateUserBalance(userId, profitLoss);
          updateUserBets(userId, 1);
        }
      }
    }
  }

  generateOrders(userId, gameType, profiLoss, buttonResponse, gameResults) {
    if (!buttonResponse || !buttonResponse.participatedInColorPrediction) {
      return 0; // The client didn't participate in the game, so no profit or loss.
    }
    const orders = [];

    const { period, colorPredictionInfo } = buttonResponse;

    // Create order objects for color bets
    for (const colorBet of colorPredictionInfo.colorBets) {
      const order = {
        userId: userId,
        period: period,
        game: gameType,
        select: colorBet.color,
        betamount: colorBet.amountBetted * colorBet.totalBetsOnColor,
        results: gameResults, // Store the result as an array
        profitLoss: profiLoss,
      };
      orders.push(order);
    }

    return orders;
  }

  updateOrdersForAllUsers(gameResults, getUserDetails) {
    if (!getUserDetails) return 0;

    const users = Object.keys(getUserDetails);
    for (const userId of users) {
      const userResponses = getUserDetails[userId];
      const userResponseArray = userResponses.responses;
      for (const userResponse of userResponseArray) {
        const profitLoss = this.calculateProfitLoss(userResponse, gameResults);
        const orders = this.generateOrders(
          userId,
          "colorpredictionquiz",
          profitLoss,
          userResponse,
          gameResults
        );

        // Update user orders
        if (userResponse.participatedInColorPrediction) {
          addOrdersToUser(userId, orders);
          addOrdersToDatabase(orders);
        }
      }
    }
  }
}

export { ColorPredictionGame, QuizGame }; // Check Profit Loss Function in color prediction
