import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

import Header from "../components/Header";
import useLimitedCapacityArray from "../custom-hooks/useLimitedCapacityArray";
import generateRandomUserDataArray from "../modules/generateRandomDataArray";
import { replaceDigitsWithY } from "../modules/replaceDigitsWithY";
import RulePage from "../components/RulePage";

const SERVER_URL =
  "http://localhost:8000" ||
  process.argv[2] ||
  "moneyballstore.webpubsub.azure.com";
const SOCKET_PATH =
  "/api/v1/games/easyparty" || "/clients/socketio/hubs/easy_hub";
const TIMER_INTERVAL = 1000;
const INITIAL_COUNTDOWN = 30;

export default function EasyParity() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]);

  // Read 'token' and 'userId' cookies
  const token = cookies.crazygames_auth;
  const userId = cookies.crazygames_userId;

  // State variables
  const [timeLeft, setTimeLeft] = useState(INITIAL_COUNTDOWN);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [buttonColor, setButtonColor] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const initialBetAmountAndNumber = {
    colors: {
      red: 0,
      violet: 0,
      green: 0,
    },
  };

  const [betAmounts, setBetAmounts] = useState(initialBetAmountAndNumber);
  const [numberOfBets, setNumberOfBets] = useState(initialBetAmountAndNumber);
  const [totalAmounts, setTotalAmounts] = useState(initialBetAmountAndNumber);
  const [limitedCapacityArray, pushLimitedCapacityArray] =
    useLimitedCapacityArray(29);
  const [showOrder, setShowOrder] = useState(true);
  const [userDataArrays, setUserDataArrays] = useState([]);
  const [period, setPeriod] = useState(200);
  const [balance, setBalance] = useState();
  const [userOrders, setUserOrders] = useState();
  const initialButtonResponses = {
    userId: userId,
    participatedInColorPrediction: false,
    gameType: "colorprediction",
    period: period,
    colorPredictionInfo: {
      colorsSelected: [],
      colorBets: [],
    },
  };
  const [buttonResponses, setButtonResponses] = useState(
    initialButtonResponses
  );
  const [showRule, setShowRule] = useState(false);

  // Unique for quiz color prediction game
  const [expression, setExpression] = useState("");
  const [rExpression, setRExpression] = useState("");
  const [firstBet, setFirstBet] = useState(false);
  const [secondBet, setSecondBet] = useState(false);
  const [firstBetInfo, setFirstBetInfo] = useState({
    color: "",
    amountBetted: 0,
    totalBetsOnColor: 0,
  });
  const [betAmount, setBetAmount] = useState(0);
  const [numberOfBet, setNumberOfBet] = useState(0);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const minuteDigits =
      minutes < 10 ? [0, minutes] : String(minutes).split("").map(Number);
    const secondDigits =
      seconds < 10 ? [0, seconds] : String(seconds).split("").map(Number);

    return [...minuteDigits, ...secondDigits];
  };

  const handleFirstBet = (color) => {
    const updatedTotalAmounts = { ...totalAmounts };

    // Update total amounts for colors
    if (color) {
      updatedTotalAmounts.colors[color] += betAmount * numberOfBet;
    }

    // Set the updated total amounts
    setTotalAmounts(updatedTotalAmounts);
    setBetAmounts(initialBetAmountAndNumber);
    setNumberOfBets(initialBetAmountAndNumber);
    setBetAmount(0);
    setNumberOfBet(0);
  };

  const handleRuleClick = () => {
    if (showRule === false) {
      setShowRule(true);
      setModalIsOpen(true);
    } else {
      setShowRule(false);
      setModalIsOpen(false);
    }
  };

  const handleToggleOrder1 = () => {
    setShowOrder(true);
  };

  const handleToggleOrder2 = () => {
    setShowOrder(false);
  };

  const toggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
    setModalIsOpen(true);
    setSelectedColor(color);

    if (!secondBet) {
      setSecondBet(true);
      handleFirstBet(color);
    }
  };

  const updateTotalAmounts = (color) => {
    const updatedTotalAmounts = { ...totalAmounts };

    // Update total amounts for colors
    if (color && betAmounts.colors[color] && numberOfBets.colors[color]) {
      updatedTotalAmounts.colors[color] +=
        betAmounts.colors[color] * numberOfBets.colors[color];
    }

    // Set the updated total amounts
    setTotalAmounts(updatedTotalAmounts);

    // Initialize betAmounts and numberOfBets
    setBetAmounts(initialBetAmountAndNumber);
    setNumberOfBets(initialBetAmountAndNumber);
    alert("Bets Placed");
    setSelectedColor("");
    setModalIsOpen(false);
  };

  // To update the bet amount for a specific color
  const updateBetAmounts = (color, amount) => {
    const totalBetAmount = calculateTotalBetAmount(betAmounts, numberOfBets);
    const newTotalBetAmount = totalBetAmount + amount;

    if (newTotalBetAmount > balance) {
      alert("Low balance");
      return 0;
    }

    setBetAmounts((prevBetAmounts) => ({
      ...prevBetAmounts,
      colors: {
        ...prevBetAmounts.colors,
        [color]: amount,
      },
    }));
  };

  // Function to update the number of bets for a specific color
  const updateNumberOfBets = (color, increment) => {
    const totalBetAmount = calculateTotalBetAmount(betAmounts, numberOfBets);
    const newTotalBetAmount = totalBetAmount + (increment ? 1 : -1);

    if (newTotalBetAmount > balance) {
      alert("Low balance");
      return 0;
    }

    setNumberOfBets((prevNumberOfBets) => ({
      ...prevNumberOfBets,
      colors: {
        ...prevNumberOfBets.colors,
        [color]: Math.max(
          prevNumberOfBets.colors[color] + (increment ? 1 : -1),
          0
        ),
      },
    }));
  };

  // Function to update the bet amount for the first bet
  const updateBetAmount = (amount) => {
    const totalBetAmount = betAmount * numberOfBet;
    const newTotalBetAmount = totalBetAmount + amount;

    if (newTotalBetAmount > balance) {
      alert("Low balance");
      return 0;
    }

    setBetAmount(amount);
  };

  // Function to update the number of bets for the first bet
  const updateNumberOfBet = (increment) => {
    const totalBetAmount = betAmount * numberOfBet;
    const newTotalBetAmount = totalBetAmount + (increment ? 1 : -1);

    if (newTotalBetAmount > balance) {
      alert("Low balance");
      return 0;
    }

    setNumberOfBet((prevNumberOfBet) =>
      Math.max(prevNumberOfBet + (increment ? 1 : -1), 0)
    );
  };

  // To initialize button responses
  const initializeButtonResponses = () => {
    setButtonResponses(initialButtonResponses);
  };

  // Function to generate and set random user data
  const generateRandomUserData = () => {
    const newData = generateRandomUserDataArray();
    setUserDataArrays(newData);
  };

  const textColorClass = (() => {
    switch (selectedColor) {
      case "red":
        return "text-red-500"; // Set to the red text color
      case "violet":
        return "text-violet-500"; // Set to the violet text color
      case "green":
        return "text-green-500"; // Set to the green text color
      default:
        return "text-black";
    }
  })();

  // An async function to fetch the user's balance
  async function fetchUserBalance() {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/balance",
        {
          userId: userId,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { balance } = response.data;
        setBalance(balance);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }

      console.log(balance);
    } catch (error) {
      console.error("Error fetching user balance:", error.message);
    }
  }

  // An async function to fetch the user's orders
  async function fetchUserOrders() {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/toporders",
        {
          userId: userId,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { orders } = response.data;
        setUserOrders(orders);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error.message);
    }
  }

  // Function to calculate the total bet amount
  function calculateTotalBetAmount(betAmounts, numberOfBets) {
    let totalBetAmount = 0;

    // Calculate the total bet amount for colors
    for (const color of Object.keys(betAmounts.colors)) {
      totalBetAmount += betAmounts.colors[color];
    }

    // Calculate the total number of bets for colors
    for (const color of Object.keys(numberOfBets.colors)) {
      totalBetAmount += numberOfBets.colors[color];
    }

    return totalBetAmount;
  }

  useEffect(() => {
    if (!token || !userId) {
      // Delete Cookie
      removeCookie("crazygames_auth");
      removeCookie("crazygames_userId");
      navigate("/auth/login"); // Redirect to the login page if the token is missing
      return;
    }

    // fetch data
    fetchUserBalance();
    fetchUserOrders();
    generateRandomUserData();
  }, [userId, token]);

  useEffect(() => {
    const socket = io(SERVER_URL, {
      path: SOCKET_PATH,
      auth: {
        crazygames_auth: token,
      },
    });

    // Timer logic
    let timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 10) {
          setButtonsDisabled(true);
          setButtonColor(true);
          setModalIsOpen(false);
        }

        if (firstBet && !secondBet && prevTime === 10) {
          // Evaluate the color and set selectedColor accordingly
          const color = eval(expression);
          let colorArgs;
          if (color % 2 === 0) {
            colorArgs = "green";
          } else {
            colorArgs = "red";
          }

          console.log(color, colorArgs);

          setSelectedColors([...selectedColors, colorArgs]);
          handleFirstBet(colorArgs);
        }

        if (prevTime === 10) {
          setButtonsDisabled(true);
          setButtonColor(true);
        }

        if (prevTime === 8) {
          commonParticipationLogic();
        }

        if (prevTime === 6) {
          socket.emit("buttonClick", buttonResponses);
          console.log(buttonResponses);
        }

        if (!firstBet && prevTime === 20) {
          setModalIsOpen(false);
        } else if (firstBet && prevTime == 20) {
          setButtonsDisabled(false);
          setButtonColor(false);
          setModalIsOpen(false);
        }

        return prevTime - 1;
      });
    }, TIMER_INTERVAL);

    // All 'ON' Events
    socket.on("connection", () => {
      console.log("Connected from FastParty");
    });

    socket.on("initialResponse", (secondMod20, expression, count) => {
      setTimeLeft(secondMod20);
      setExpression(expression);
      const replace = replaceDigitsWithY(expression);
      setRExpression(replace);
      setButtonsDisabled(true);
      setButtonColor(true);
      setPeriod(count);
    });

    socket.on("responsesReceived", (message) => {
      console.log(message);
    });

    // Reset timer and UI when the "reset" event is received
    socket.on("reset", (expression, gameResult, period) => {
      setPeriod(period);

      // Set expression for the hint
      setExpression(expression);
      const replace = replaceDigitsWithY(expression);
      setRExpression(replace);

      // Push in a limited capacity array for game history
      pushLimitedCapacityArray(gameResult);

      if (timer) {
        clearInterval(timer);
      }

      setTimeLeft(INITIAL_COUNTDOWN);
      setButtonsDisabled(true);
      setButtonColor(true);
      setSelectedColors([]);
      setModalIsOpen(true);
      initializeButtonResponses();
      setBetAmounts(initialBetAmountAndNumber);
      setNumberOfBets(initialBetAmountAndNumber);
      setTotalAmounts(initialBetAmountAndNumber);
      setFirstBet(false);
      setSecondBet(false);
      setFirstBetInfo({
        color: "",
        amountBetted: 0,
        totalBetsOnColor: 0,
      });
      setBetAmount(0);
      setNumberOfBet(0);

      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 10) {
            setButtonsDisabled(true);
            setButtonColor(true);
            setModalIsOpen(false);
          }

          if (firstBet && !secondBet && prevTime === 10) {
            // Evaluate the color and set selectedColor accordingly
            const number = eval(expression);
            let color;
            if (number % 2 === 1) {
              color = "red";
            } else {
              color = "green";
            }

            console.log(color);

            setSelectedColors([...selectedColors, color]);
            handleFirstBet(colorArgs);
          }

          if (prevTime === 10) {
            setButtonsDisabled(true);
            setButtonColor(true);
          }

          if (prevTime == 8) {
            commonParticipationLogic();
          }

          if (prevTime === 6) {
            socket.emit("buttonClick", buttonResponses);
            console.log(buttonResponses);
          }

          if (!firstBet && prevTime === 20) {
            setModalIsOpen(false);
          } else if (firstBet && prevTime == 20) {
            setButtonsDisabled(false);
            setButtonColor(false);
            setModalIsOpen(false);
          }

          return prevTime - 1;
        });
      }, TIMER_INTERVAL);

      fetchUserBalance();
      fetchUserOrders();
      generateRandomUserData();
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from FastParty");
      // Perform actions upon disconnection
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
      clearInterval(timer);
    };
  }, [
    betAmounts,
    numberOfBets,
    buttonResponses,
    firstBet,
    firstBetInfo,
    secondBet,
    totalAmounts,
    betAmount,
    numberOfBet,
  ]);

  const commonParticipationLogic = () => {
    if (!firstBet) {
      // Reset button responses and close the modal if it's not the first bet
      setButtonResponses(initialButtonResponses);
      setModalIsOpen(false);
      return;
    }

    const MINIMUM_BET_AMOUNT = 10;
    const isAnyColorSelected = selectedColors.length > 0;

    // Calculate whether there's a bet greater than or equal to 10 for each color (red, violet, green)
    const hasRedBet = totalAmounts.colors["red"] >= MINIMUM_BET_AMOUNT;
    const hasVioletBet = totalAmounts.colors["violet"] >= MINIMUM_BET_AMOUNT;
    const hasGreenBet = totalAmounts.colors["green"] >= MINIMUM_BET_AMOUNT;

    // Determine if the user can participate based on colors and numbers
    const canParticipate =
      isAnyColorSelected && (hasRedBet || hasVioletBet || hasGreenBet);

    if (canParticipate) {
      // Use the functional form of setButtonResponses to ensure the latest state is used
      setButtonResponses((prevButtonResponses) => ({
        ...prevButtonResponses,
        participatedInColorPrediction: true,
        period: period,
        colorPredictionInfo: {
          colorsSelected: selectedColors,
          colorBets: selectedColors.map((color) => ({
            color,
            amountBetted: totalAmounts.colors[color],
            totalBetsOnColor: 1,
          })),
        },
      }));
    }

    console.log(canParticipate, firstBetInfo);
    // Close the modal
    setModalIsOpen(false);
  };
  return (
    <div className="col-lg-4 col-md-6 w-full relative">
      <div>
        <Header title="EasyParity" onButtonClick={handleRuleClick} />
      </div>
      <div className=" text-base max-w-[100%] pb-2 px-4 bg-white">
        <div className="flex flex-wrap mt-2 pt-2">
          <div className="basis-1/2 whitespace-nowrap text-left w-full max-w-[50%] px-4">
            <div className="text-gray-500 mb-2">Period</div>
            <div className="text-gray-800 text-2xl font-semibold" id="cpd">
              {period}
            </div>
          </div>
          <div className="basis-1/2 text-right w-full max-w-[50%] px-4 relative">
            <div className="text-base text-gray-500 mb-2">Count Down</div>
            <div className="cd" onclick="CRN30SP()">
              <span className="inline-block text-center text-gray-800 text-2xl font-medium leading-8 rounded h-8 w-7 mx-1 px-1 bg-slate-300">
                {formatTime(timeLeft)[0]}
              </span>
              <span
                className="inline-block text-center text-gray-800 text-2xl font-medium leading-8 rounded h-8 w-7 mx-1 px-1 bg-slate-300"
                id="fsm"
              >
                {formatTime(timeLeft)[1]}
              </span>
              :
              <span
                className="inline-block text-center text-gray-800 text-2xl font-medium leading-8 rounded h-8 w-7 mx-1 px-1 bg-slate-300"
                id="fs0"
              >
                {formatTime(timeLeft)[2]}
              </span>
              <span
                class="inline-block text-center text-gray-800 text-2xl font-medium leading-8 rounded h-8 w-7 mx-1 px-1 bg-slate-300"
                id="fs1"
              >
                {formatTime(timeLeft)[3]}
              </span>
            </div>
            <div id="cdx"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center text-[#333] min-h-[100px] w-full mt-4 mb-1 border border-solid border-[#d0ebff] rounded bg-[#f9fcff]">
        <div className="white-space-nowrap basis-1/8 text-lg text-gray-800 font-bold w-full max-w-[100%] h-full leading-10 bg-white cursor-pointer overflow-hidden">
          <div className="flex flex-col">
            <span className="h-6">ex : 1 + 2 * 3 - 4</span>
            <span className="h-6 border-solid border-yellow-300">
              {firstBet ? expression : rExpression}
            </span>
            <span className="h-8">1, 2, 3, 4, 5, 6, 7, 8, 9</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap text-lg mt-6 mr-6">
        <div
          className={`basis-1/3 w-full max-w-[33.33%] relative ${
            selectedColors.includes("green") ? "selected" : ""
          }`}
          onClick={buttonsDisabled ? null : () => toggleColor("green")}
        >
          <div
            className={`cursor-pointer whitespace-nowrap text-slate-50 font-medium leading-6 h-16 m-1 rounded-md pt-2 ${
              buttonColor ? "bg-gray-400" : "bg-green-600" // Change 'bg-blue-600' to the default color you want
            }`}
            id="jcg"
          >
            <div className="tfw-6">
              <span className="rocket sm"></span>
            </div>
            <div className="tfw-5">Join Green</div>
          </div>
          <div className="text-sm leading-3 text-gray-500">1:0.1</div>
        </div>
        <div
          className={`basis-1/3 w-full max-w-[33.33%] relative ${
            selectedColors.includes("violet") ? "selected" : ""
          }`}
          onClick={buttonsDisabled ? null : () => toggleColor("violet")}
        >
          <div
            className={`cursor-pointer whitespace-nowrap text-slate-50 font-medium leading-6 h-16 m-1 rounded-md pt-2 ${
              buttonColor ? "bg-gray-400" : "bg-violet-900"
            }`}
            id="jcv"
          >
            <div className="tfw-6">
              <span className="rocket sm"></span>
            </div>
            <div className="tfw-5">Join Violet</div>
          </div>
          <div className="text-sm leading-3 text-gray-500">1:0.1</div>
        </div>
        <div
          className={`basis-1/3 w-full max-w-[33.33%] relative ${
            selectedColors.includes("red") ? "selected" : ""
          }`}
          onClick={buttonsDisabled ? null : () => toggleColor("red")}
        >
          <div
            className={`cursor-pointer whitespace-nowrap text-slate-50 font-medium leading-6 h-16 m-1 rounded-md pt-2 ${
              buttonColor ? "bg-gray-400" : "bg-red-600"
            }`}
            id="jcr"
          >
            <div className="tfw-6">
              <span className="rocket sm"></span>
            </div>
            <div className="tfw-5">Join Red</div>
          </div>
          <div className="text-sm leading-3 text-gray-500">1:0.1</div>
        </div>
      </div>
      <div className="w-full max-w-[100%] mt-2 px-4">
        <div className="flex flex-col h-72 bg-white border-solid border border-slate-300">
          <div className="white-space-nowrap basis-1/8 text-lg text-gray-800 font-bold w-full max-w-[100%] h-12 border-b-4 border-[#06d6a0] leading-10 bg-white cursor-pointer overflow-hidden">
            Record
          </div>
          <div className="basis-7/8 w-full max-w-[100%] px-4 relative">
            <div className="flex flex-wrap">
              <div className="basis-2/3 flex-[0_0_66.666667%] text-lg text-gray-800 text-left w-full max-w-[66.66%] my-2 pr-4 pl-0 pb-2 relative">
                Easy-Parity Record(s)
              </div>
              <div className="basis-1/3 flex-[0_0_33.333333%] text-sm text-right w-full max-w-[33.333%] my-2 pb-2 pr-0 pl-4">
                <span className="text-gray-500 cursor-pointer">more</span>
              </div>
              <div className="w-full flex-[0_0_100%] max-w-[100%] px-4 relative">
                <div className="flex flex-wrap text-base">
                  {limitedCapacityArray.map((result, index) => (
                    <History
                      key={index}
                      color={result}
                      period={period - limitedCapacityArray.length + index}
                    />
                  ))}
                  <History color="" number="" period={period} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap text-[#666] mr-0"></div>
        <div className="flex flex-wrap mt-2 border-t-2 border-t-slate-200">
          <div
            className={`flex-[0_0_50%] min-w-[50%] w-full font-semibold pt-4 px-4 tabin active rounded-t-6 h-12 whitespace-nowrap leading-48 transition duration-200 cursor-pointer overflow-hidden text-lg mt-[-10px] bg-white relative ${
              showOrder
                ? "text-black border-3 border-b-blue-500"
                : "text-slate-400"
            }`}
            id="vevod"
            onClick={handleToggleOrder1}
          >
            Everyone's Order
          </div>
          <div
            className={`flex-[0_0_50%] min-w-[50%] w-full font-semibold pt-4 px-4 tabin active rounded-t-6 h-12 whitespace-nowrap leading-48 transition duration-200 cursor-pointer overflow-hidden text-lg mt-[-10px] bg-white relative ${
              showOrder
                ? "text-slate-400"
                : "text-black border-b-3 border-b-blue-500"
            }`}
            id="vmyod"
            onClick={handleToggleOrder2}
          >
            My Order
          </div>
          {showOrder ? (
            <div
              className="flex-[0_0_100%] text-[#666] w-full max-w-[100%] min-h-[428px] px-4 bg-white relative"
              id="ev"
            >
              <div className="flex flex-wrap">
                <div className="flex-[0_0_33.333333%] max-w-[33.3333333%] w-full px-4 relative text-base text-left pt-2">
                  Period
                </div>
                <div className="flex-[0_0_25%] max-2-[50%] w-full px-4 relative text-base pt-2">
                  User
                </div>
                <div className="flex-[0_0_16.666667%] max-2-[16.666667%] w-full px-4 relative text-base pt-2">
                  Select
                </div>
                <div className="flex-[0_0_20%] max-2-[50%] w-full px-4 relative text-base pt-2 xtr">
                  Point
                </div>
              </div>
              <div className="flex flex-wrap">
                <div
                  className="flex-[0_0_100%] max-w-[100%] w-full px-4"
                  id="peod"
                >
                  {userDataArrays.map((result, index) => (
                    <EveryoneOrder
                      key={index}
                      userId={result[0]}
                      color={result[1]}
                      number={result[2]}
                      amount={result[3]}
                      period={period}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex-[0_0_100%] max-w-[100%] w-full px-4"
              id="order"
            >
              <div className="flex flex-wrap pb-2">
                <div className="flex-[0_0_100%] flex text-base max-w-[100%] w-full px-4 pb-3 pt-2 relative">
                  <div className="inline-block flex-[26.85%] text-left">
                    Period
                  </div>
                  <div className="inline-block flex-[12.08%]">Select</div>
                  <div className="inline-block flex-[15.44%]">Point</div>
                  <div className="inline-block flex-[12.08%]">Result</div>
                  <div className="inline-block flex-[33.55%] tet-right">
                    Amount
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12" id="mywod"></div>
                <div className="col-12" id="myod"></div>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="m-order" id="moreod" onclick="podx20()">
                    more &gt;
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {modalIsOpen && (
        <div className="absolute flex-[0_0_100%] w-[100%] max-w-[0_0_100%] px-4">
          <div className="col-lg-4 col-md-6 fixed w-[100%] px-4 bottom-0 left-0 right-0 mx-auto p-3 bg-gray-100 rounded-t-lg shadow-md z-50">
            {selectedColor && (
              <div className="text-base max-w-[100%] pb-2 px-4 bg-white">
                <div className="p-4">
                  <h1 className={`text-2xl font-bold ${textColorClass}`}>
                    Join {selectedColor}
                  </h1>
                </div>
                <div className="flex flex-wrap w-full mt-2 pt-2">
                  <button
                    className="text-center text-base text-white font-semibold flex-1/3 w-20 h-10 px-2 bg-red-600 rounded-md cursor-pointer"
                    onClick={() => updateNumberOfBets(selectedColor, false)}
                  >
                    -
                  </button>
                  <span className="flex-1 flex justify-center text-center rounded-md mx-2 py-2 bg-green-100">
                    {numberOfBets.colors[selectedColor]}
                  </span>
                  <button
                    className="text-center text-base text-white font-semibold flex-1/3 w-20 h-10 px-2 bg-green-600 rounded-md cursor-pointer"
                    onClick={() => updateNumberOfBets(selectedColor, true)}
                  >
                    +
                  </button>
                </div>
                <div className="contents basis-1 w-full max-w-[100%] px-4">
                  <div className="flex w-full space-x-1 justify-center">
                    <div className="inline-block w-[10%]">
                      <div className="white-space-nowrap text-base font-bold my-2 mx-1 py-1 rounded-sm h-9 border-solid border-2 border-gray-500 bg-contain bg-blend-soft-light cursor-pointer">
                        ₹
                        {numberOfBets.colors[selectedColor] *
                          betAmounts.colors[selectedColor]}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contents basis-1 w-full max-w-[100%] px-4">
                  <div className="flex w-full space-x-1">
                    {[100, 200, 500, 1000, 2000, 5000].map((amount, index) => (
                      <div className="inline-block w-[20%]" key={index}>
                        <div
                          className={`white-space-nowrap text-base my-2 mx-1 py-2 rounded-sm h-9 border-solid border border-gray-400 bg-contain bg-blend-soft-light cursor-pointer ${
                            betAmounts.colors[selectedColor] === amount
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            updateBetAmounts(selectedColor, amount)
                          }
                        >
                          ₹{amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className="flex-1/4 text-center text-base text-white font-semibold h-10 w-28 px-2 bg-[#06d6a0] rounded-xl cursor-pointer"
                    onClick={() => {
                      updateTotalAmounts(selectedColor);
                    }}
                  >
                    Make Bet
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-4 col-md-6 fixed w-[100%] px-4 bottom-0 left-0 right-0 mx-auto p-3 bg-gray-100 rounded-t-lg shadow-md z-50">
            {!firstBet && (
              <div className="text-base max-w-[100%] pb-2 px-4 bg-white">
                <div className="p-4">
                  <h1 className={`text-2xl font-bold text-black`}>
                    Make First Bet
                  </h1>
                </div>
                <div className="flex flex-wrap w-full mt-2 pt-2">
                  <button
                    className="text-center text-base text-white font-semibold flex-1/3 w-20 h-10 px-2 bg-red-600 rounded-md cursor-pointer"
                    onClick={() => updateNumberOfBet(false)}
                  >
                    -
                  </button>
                  <span className="flex-1 flex justify-center text-center rounded-md mx-2 py-2 bg-green-100">
                    {numberOfBet}
                  </span>
                  <button
                    className="text-center text-base text-white font-semibold flex-1/3 w-20 h-10 px-2 bg-green-600 rounded-md cursor-pointer"
                    onClick={() => updateNumberOfBet(true)}
                  >
                    +
                  </button>
                </div>
                <div className="contents basis-1 w-full max-w-[100%] px-4">
                  <div className="flex w-full space-x-1 justify-center">
                    <div className="inline-block w-[10%]">
                      <div className="white-space-nowrap text-base font-bold my-2 mx-1 py-1 rounded-sm h-9 border-solid border-2 border-gray-500 bg-contain bg-blend-soft-light cursor-pointer">
                        ₹{numberOfBet * betAmount}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contents basis-1 w-full max-w-[100%] px-4">
                  <div className="flex w-full space-x-1">
                    {[100, 200, 500, 1000, 2000, 5000].map((amount, index) => (
                      <div className="inline-block w-[20%]" key={index}>
                        <div
                          className={`white-space-nowrap text-base my-2 mx-1 py-2 rounded-sm h-9 border-solid border border-gray-400 bg-contain bg-blend-soft-light cursor-pointer ${
                            betAmounts.colors[selectedColor] === amount
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => updateBetAmount(amount)}
                        >
                          ₹{amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    className="flex-1/4 text-center text-base text-white font-semibold h-10 w-28 px-2 bg-[#06d6a0] rounded-xl cursor-pointer"
                    onClick={() => {
                      if (numberOfBet * betAmount > 0) {
                        setSelectedColor("");
                        setFirstBet(true);
                      } else {
                        alert("Total Bet Amount is zero");
                      }
                    }}
                  >
                    Make Bet
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-4 col-md-6 fixed w-[100%] px-4 bottom-0 left-0 right-0 mx-auto p-3 bg-gray-100 rounded-t-lg shadow-md z-50">
            {showRule && <RulePage gameName="easyParity" />}
          </div>
        </div>
      )}
    </div>
  );
}

function History({ color, period }) {
  const getColorLetter = () => {
    if (color === "green") {
      return "G";
    } else if (color === "red") {
      return "R";
    } else if (color === "violet") {
      return "V";
    }
    return "?"; // Return an empty string if color is empty or unknown
  };

  function showLastThreeDigits(period) {
    // Ensure number is positive
    const positiveNumber = Math.abs(period);

    // Convert the number to a string
    const numberString = positiveNumber.toString();

    // Check if the number has at least three digits
    if (numberString.length >= 3) {
      // Get the last three characters of the string
      const lastThreeDigits = numberString.slice(-3);

      // Return the last three digits as an integer
      return parseInt(lastThreeDigits, 10);
    } else {
      // If the number has fewer than three digits, return the original number
      return positiveNumber;
    }
  }
  const colorStyles = {
    red: {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#fa3c09",
    },
    green: {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#00c282",
    },
    violet: {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#6655d3",
    },
  };

  const backgroundColorStyle = colorStyles[color] || {
    boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
    background: "#f57c00",
  };

  const displayNumber = getColorLetter();

  return (
    <div className="grid justify-center w-[10%] p-[1px] mb-2">
      <div
        className="inline-block text-white text-center leading-7 h-7 w-[28px] rounded-[50%]"
        style={backgroundColorStyle}
      >
        <div className=""></div>
        <div className="relative">{displayNumber}</div>
      </div>
      <div className="text-sm font-bold text-[#515151]">
        {showLastThreeDigits(period)}
      </div>
    </div>
  );
}

function EveryoneOrder({ userId, color, number, amount, period }) {
  const getColorLetter = () => {
    if (color === "green") {
      return "G";
    } else if (color === "red") {
      return "R";
    } else if (color === "violet") {
      return "V";
    }
    return "G"; // Return an empty string if color is empty or unknown
  };

  const colorStyles = {
    red: {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#fa3c09",
    },
    green: {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#00c282",
    },
    violet: {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#6655d3",
    },
  };

  const backgroundColorStyle = colorStyles[color] || {
    boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
    background: "#00c282",
  };

  const displayValue = getColorLetter();

  return (
    <>
      <div className="flex flex-wrap pt-2 pb-2 h-12 leading-8">
        <div className="flex-[0_0_33.333333%] text-left max-w-[33.3333333%] w-full px-4 relative">
          {period}
        </div>
        <div className="flex-[0_0_25%] max-2-[50%] w-full text-sm">
          {userId}
        </div>
        <div className="flex-[0_0_16.666667%] max-2-[16.666667%] w-full relative">
          <span
            className="inline-block text-white text-center leading-7 h-7 w-[28px] rounded-[50%]"
            style={backgroundColorStyle}
          >
            {displayValue}
          </span>
        </div>
        <div className="flex-[0_0_25%] max-2-[50%] w-full realtive text-center">
          ₹{amount}
        </div>
      </div>
    </>
  );
}
