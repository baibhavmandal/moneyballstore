import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import process from "process";

import Header from "../components/Header";
import useLimitedCapacityArray from "../custom-hooks/useLimitedCapacityArray";
import generateRandomUserDataArray from "../modules/generateRandomDataArray";
import RulePage from "../components/RulePage";
import baseURL from "../baseURL";

const SERVER_URL =
  process.argv[2] || "https://moneyballstore.webpubsub.azure.com";
const SOCKET_PATH = "/clients/socketio/hubs/spare_hub";
const TIMER_INTERVAL = 1000;
const INITIAL_COUNTDOWN = 180;

// Socket url for development "/api/v1/games/spareparty"

function SpareParity() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]);
  const token = cookies.crazygames_auth; // Read 'token' cookie
  const userId = cookies.crazygames_userId; // Read 'userId' cookie

  // State variables
  const [timeLeft, setTimeLeft] = useState(INITIAL_COUNTDOWN);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [buttonColor, setButtonColor] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const initialBetAmountAndNumber = {
    colors: {
      red: 0,
      violet: 0,
      green: 0,
    },
    numbers: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
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
  const [balance, setBalance] = useState(0);
  const [userOrders, setUserOrders] = useState();
  const initialButtonResponses = {
    userId: userId,
    participatedInColorPrediction: false,
    gameType: "colorprediction",
    period: period,
    colorPredictionInfo: {
      colorsSelected: [],
      numbersSelected: [],
      colorBets: [],
      numberBets: [],
    },
  };
  const [buttonResponses, setButtonResponses] = useState(
    initialButtonResponses
  );
  const [showRule, setShowRule] = useState(false);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const minuteDigits =
      minutes < 10 ? [0, minutes] : String(minutes).split("").map(Number);
    const secondDigits =
      seconds < 10 ? [0, seconds] : String(seconds).split("").map(Number);

    return [...minuteDigits, ...secondDigits];
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
    setSelectedNumber(null);
  };

  const toggleNumber = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
    setModalIsOpen(true);
    setSelectedNumber(number);
    setSelectedColor("");
  };

  const updateTotalAmounts = (color, number) => {
    const updatedTotalAmounts = { ...totalAmounts };

    // Update total amounts for colors
    if (color && betAmounts.colors[color] && numberOfBets.colors[color]) {
      updatedTotalAmounts.colors[color] +=
        betAmounts.colors[color] * numberOfBets.colors[color];
    }

    // Update total amounts for numbers
    if (
      number !== undefined &&
      betAmounts.numbers[number] &&
      numberOfBets.numbers[number]
    ) {
      updatedTotalAmounts.numbers[number] +=
        betAmounts.numbers[number] * numberOfBets.numbers[number];
    }

    // Set the updated total amounts
    setTotalAmounts(updatedTotalAmounts);

    // Initialize betAmounts and numberOfBets
    setBetAmounts(initialBetAmountAndNumber);
    setNumberOfBets(initialBetAmountAndNumber);
    alert("Bets Placed");
    setSelectedColor("");
    setSelectedNumber(null);
    setModalIsOpen(false);
  };

  // To update the bet amount for a specific color
  const updateBetAmount = (color, amount) => {
    setBetAmounts((prevBetAmounts) => ({
      ...prevBetAmounts,
      colors: {
        ...prevBetAmounts.colors,
        [color]: amount,
      },
    }));
    console.log(betAmounts);
  };

  // To update the number of bets for a specific color
  const updateNumberOfBets = (color, increment) => {
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
    console.log(numberOfBets);
  };

  // To update the bet amount for a specific number
  const updateNumberBetAmount = (number, amount) => {
    setBetAmounts((prevBetAmounts) => ({
      ...prevBetAmounts,
      numbers: {
        ...prevBetAmounts.numbers,
        [number]: amount,
      },
    }));
    console.log(betAmounts);
  };

  // To update the number of bets for a specific number
  const updateNumberNumberOfBets = (number, increment) => {
    setNumberOfBets((prevNumberOfBets) => ({
      ...prevNumberOfBets,
      numbers: {
        ...prevNumberOfBets.numbers,
        [number]: Math.max(
          prevNumberOfBets.numbers[number] + (increment ? 1 : -1),
          0
        ),
      },
    }));
    console.log(numberOfBets);
  };

  // To initiaize buttonresponse
  const initializeButtonResponses = () => {
    setButtonResponses(initialButtonResponses);
  };

  // Function to generate and set random user data
  const generateRandomUserData = () => {
    const newData = generateRandomUserDataArray();
    setUserDataArrays(newData);
  };

  const resetGameState = () => {
    setTimeLeft(INITIAL_COUNTDOWN);
    setButtonsDisabled(false);
    setButtonColor(false);
    setSelectedColors([]);
    setSelectedNumbers([]);
    setButtonColor("");
    setSelectedNumber(null);
    setModalIsOpen(false);
    initializeButtonResponses();
    setBetAmounts(initialBetAmountAndNumber);
    setNumberOfBets(initialBetAmountAndNumber);
    setTotalAmounts(initialBetAmountAndNumber);
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

  // A async function to fetch the user's balance
  async function fetchUserBalance() {
    try {
      const response = await axios.post(
        `${baseURL}api/v1/user/balance`,
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
        `${baseURL}api/v1/user/toporders`,
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
  function calculateTotalBetAmount(betAmounts, numberOfBets, value) {
    let totalBetAmount = 0;

    // Calculate the total bet amount for colors
    for (const color of Object.keys(betAmounts.colors)) {
      if (value === color) continue;
      totalBetAmount += betAmounts.colors[color] * numberOfBets.colors[color];
    }

    // Calculate the total bet amount for numbers
    for (const number of Object.keys(betAmounts.numbers)) {
      if (value === number) continue;
      totalBetAmount +=
        betAmounts.numbers[number] * numberOfBets.numbers[number];
    }

    return totalBetAmount;
  }

  useEffect(() => {
    if (!token || !userId) {
      // Delete Cookie
      removeCookie("crazygames_auth");
      removeCookie("crazygames_userId");
      navigate("/auth/login"); // Redirect to login page if token is missing
      return;
    }

    const socket = io(`${SERVER_URL}spare`, {
      path: SOCKET_PATH,
      transports: ["websocket"],
      auth: { crazygames_auth: token },
    });
    // Timer logic
    let timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 30) {
          setButtonsDisabled(true);
          setButtonColor(true);
        }

        if (prevTime === 30) {
          commonParticipationLogic();
          setButtonsDisabled(true);
          setButtonColor(true);
        }

        if (prevTime === 15) {
          socket.emit("sendButtonResponses", buttonResponses);
        }

        return prevTime - 1;
      });
    }, TIMER_INTERVAL);

    // fetch data
    fetchUserBalance();
    fetchUserOrders();
    generateRandomUserData();

    // All 'ON' Events
    socket.on("connection", () => {
      console.log("Connected from FastParty");
    });

    socket.on("secondMod180", (secondMod180, count) => {
      setTimeLeft(secondMod180);
      setPeriod(count);
    });

    socket.on("responsesReceived", (message, balance) => {
      setBalance(balance);
      console.log(message);
    });

    // Reset timer and UI when "reset" event is received
    socket.on("reset", (gameResult, period) => {
      console.log("Received reset event:", gameResult);
      console.log(selectedColors, selectedNumbers);
      setPeriod(period);

      pushLimitedCapacityArray(gameResult);

      if (timer) {
        clearInterval(timer);
      }

      resetGameState();

      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 30) {
            setButtonsDisabled(true);
            setButtonColor(true);
          }

          if (prevTime === 30) {
            commonParticipationLogic();
            setButtonsDisabled(true);
            setButtonColor(true);
          }

          if (prevTime === 15) {
            socket.emit("sendButtonResponses", buttonResponses);
            console.log(buttonResponses);
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
      console.log("Disconnected from SpareParty");
      // Perform actions upon disconnection
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
      clearInterval(timer);
    };
  }, [
    token,
    userId,
    balance,
    buttonResponses,
    navigate,
    betAmounts,
    numberOfBets,
    totalAmounts,
  ]);

  const commonParticipationLogic = () => {
    const isAnyColorSelected = selectedColors.length > 0;
    const isAnyNumberSelected = selectedNumbers.length > 0;

    // Calculate whether there's a bet greater than or equal to 10 for each color (red, violet, green)
    const hasRedBet = totalAmounts.colors["red"] >= 10;
    const hasVioletBet = totalAmounts.colors["violet"] >= 10;
    const hasGreenBet = totalAmounts.colors["green"] >= 10;

    // Calculate whether there's a bet greater than or equal to 10 for each number (0 to 9)
    const hasNumberBet = {};
    for (let number = 0; number <= 9; number++) {
      hasNumberBet[number] = totalAmounts.numbers[number] >= 10;
    }

    // Determine if the user can participate based on colors and numbers
    const canParticipate =
      (isAnyColorSelected && (hasRedBet || hasVioletBet || hasGreenBet)) ||
      (isAnyNumberSelected &&
        Object.values(hasNumberBet).some((hasBet) => hasBet));

    if (canParticipate) {
      // Use the functional form of setButtonResponses to ensure the latest state is used
      setButtonResponses((prevButtonResponses) => ({
        ...prevButtonResponses,
        participatedInColorPrediction: true,
        period: period,
        colorPredictionInfo: {
          colorsSelected: selectedColors,
          numbersSelected: selectedNumbers,
          colorBets: selectedColors.map((color) => ({
            color,
            amountBetted: totalAmounts.colors[color],
            totalBetsOnColor: 1,
          })),
          numberBets: selectedNumbers.map((number) => ({
            number,
            amountBetted: totalAmounts.numbers[number],
            totalBetsOnNumber: 1,
          })),
        },
      }));
      console.log(canParticipate, totalAmounts);
    } else {
      setButtonResponses(initialButtonResponses);
      console.log(canParticipate, totalAmounts);
    }

    setModalIsOpen(false);
  };

  return (
    <div className="col-lg-4 col-md-6 w-full relative">
      <div className="">
        <Header title="Spare-Parity" onButtonClick={handleRuleClick} />
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
                className="inline-block text-center text-gray-800 text-2xl font-medium leading-8 rounded h-8 w-7 mx-1 px-1 bg-slate-300"
                id="fs1"
              >
                {formatTime(timeLeft)[3]}
              </span>
            </div>
            <div id="cdx"></div>
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
            <div className="text-sm leading-3 text-gray-500">1:2</div>
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
            <div className="text-sm leading-3 text-gray-500">1:4.5</div>
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
            <div className="text-sm leading-3 text-gray-500">1:2</div>
          </div>
          <div className="w-full max-w-[100%] px-4 pt-2 relative">
            <div className="flex flex-wrap text-lg">
              <div className="contents basis-1 w-full max-w-[100%] px-4 relative">
                <div className="flex w-full space-x-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((number, index) => (
                    <div className="inline-block w-[20%]" key={(number, index)}>
                      <div
                        className={`white-space-nowrap text-xl my-2 mx-1 py-2 rounded-sm h-10 border-solid border border-gray-400 bg-contain bg-blend-soft-light cursor-pointer ${
                          selectedNumbers.includes(number) ? "selected" : ""
                        } ${
                          buttonsDisabled
                            ? "text-white bg-gray-400"
                            : "text-black bg-slate-200"
                        }`}
                        id={`jn${number}`}
                        onClick={
                          buttonsDisabled ? null : () => toggleNumber(number)
                        }
                      >
                        {number}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xs leading-3 text-gray-500 w-full max-w-[100%]">
                1:9
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[100%] px-4 relative">
        <div className="flex flex-wrap whitespace-nowrap" id="nfrm"></div>
      </div>
      <div className="w-full max-w-[100%] mt-2 px-4">
        <div className="flex flex-col h-72 bg-white border-solid border border-slate-300 border-b-2 border-b-slate-400">
          <div className="white-space-nowrap basis-1/8 text-lg text-gray-800 font-bold w-full max-w-[100%] h-12 border-b-4 border-[#06d6a0] leading-10 bg-white cursor-pointer overflow-hidden">
            Record
          </div>
          <div className="basis-7/8 w-full max-w-[100%] px-4 relative">
            <div className="flex flex-wrap">
              <div className="basis-2/3 flex-[0_0_66.666667%] text-lg text-gray-800 text-left w-full max-w-[66.66%] my-2 pr-4 pl-0 pb-2 relative">
                Fast-Parity Record(s)
              </div>
              <div className="basis-1/3 flex-[0_0_33.333333%] text-sm text-right w-full max-w-[33.333%] my-2 pb-2 pr-0 pl-4">
                <span className="text-gray-500 cursor-pointer">more</span>
              </div>
              <div className="w-full flex-[0_0_100%] max-w-[100%] px-4 relative">
                <div className="flex flex-wrap text-base">
                  {limitedCapacityArray.map((result, index) => (
                    <History
                      key={index}
                      color={result[0]}
                      number={result[1]}
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
                <div className="flex-[0_0_25%] max-w-[50%] w-full px-4 relative text-base pt-2">
                  User
                </div>
                <div className="flex-[0_0_16.666667%] max-w-[16.666667%] w-full px-4 relative text-base pt-2">
                  Select
                </div>
                <div className="flex-[0_0_20%] max-w-[50%] w-full px-4 relative text-base pt-2 xtr">
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
              <div className="flex flex-wrap">
                <div className="flex-[0_0_100%] max-w-[100%] w-full px-4">
                  {userOrders.map((value, index) => {
                    <MyOrder
                      key={index}
                      period={value.period}
                      select={value.select}
                      result={value.results}
                      amount={value.betamount}
                    />;
                  })}
                </div>
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
                    {[10, 50, 100, 500, 1000, 5000].map((amount, index) => (
                      <div className="inline-block w-[20%]" key={index}>
                        <div
                          className={`white-space-nowrap text-base my-2 mx-1 py-2 rounded-sm h-9 border-solid border border-gray-400 bg-contain bg-blend-soft-light cursor-pointer ${
                            betAmounts.colors[selectedColor] === amount
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => updateBetAmount(selectedColor, amount)}
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
                      updateTotalAmounts(selectedColor, undefined);
                    }}
                  >
                    Make Bet
                  </button>
                </div>
              </div>
            )}
            {selectedNumber !== null && (
              <div className="text-base max-w-[100%] pb-2 px-4 bg-white">
                <div className="p-4">
                  <h1 className={`text-2xl font-bold text-black`}>
                    Join {selectedNumber}
                  </h1>
                </div>
                <div className="flex flex-wrap w-full mt-2 pt-2">
                  <button
                    className="text-center text-base text-white font-semibold flex-1/3 w-20 h-10 px-2 bg-[#06d6a0] rounded-sm cursor-pointer"
                    onClick={() =>
                      updateNumberNumberOfBets(selectedNumber, false)
                    }
                  >
                    -
                  </button>
                  <span className="flex-1 text-center">
                    {numberOfBets.numbers[selectedNumber]}
                  </span>
                  <button
                    className="text-center text-base text-white font-semibold flex-1/3 w-20 h-10 px-2 bg-[#06d6a0] rounded-sm cursor-pointer"
                    onClick={() =>
                      updateNumberNumberOfBets(selectedNumber, true)
                    }
                  >
                    +
                  </button>
                </div>
                <div className="contents basis-1 w-full max-w-[100%] px-4">
                  <div className="flex w-full space-x-1 justify-center">
                    <div className="inline-block w-[10%]">
                      <div className="white-space-nowrap text-base font-bold my-2 mx-1 py-1 rounded-sm h-9 border-solid border-2 border-gray-500 bg-contain bg-blend-soft-light cursor-pointer">
                        ₹
                        {numberOfBets.numbers[selectedNumber] *
                          betAmounts.numbers[selectedNumber]}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contents basis-1 w-full max-w-[100%] px-4">
                  <div className="flex w-full space-x-1">
                    {[10, 50, 100, 500, 1000, 5000].map((amount, index) => (
                      <div className="inline-block w-[20%]" key={index}>
                        <div
                          className={`white-space-nowrap text-base my-2 mx-1 py-2 rounded-sm h-9 border-solid border border-gray-400 bg-contain bg-blend-soft-light cursor-pointer ${
                            betAmounts.numbers[selectedNumber] === amount
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            updateNumberBetAmount(selectedNumber, amount)
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
                      updateTotalAmounts(undefined, selectedNumber);
                    }}
                  >
                    Make Bet
                  </button>
                </div>
              </div>
            )}
            {showRule && <RulePage gameName="fastParity" />}
          </div>
        </div>
      )}
    </div>
  );
}

function History({ color, number, period }) {
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
    "violet-green": {
      // Add more styles for violet if needed
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#00c282",
    },
    "violet-red": {
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
      background: "#fa3c09",
    },
  };

  const emptyStyles = {
    "violet-green": {
      // Add more styles for violet if needed
      backgroundColor: "rgb(102, 85, 211)",
      position: "absolute",
      width: "14px",
      borderRadius: "0 15px 15px 0",
      color: "white",
      textAlign: "center",
      height: "28px",
      display: "inline-block",
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 2px",
    },
    "violet-red": {
      backgroundColor: "rgb(102, 85, 211)",
      position: "absolute",
      width: "14px",
      borderRadius: "0 15px 15px 0",
      color: "white",
      textAlign: "center",
      height: "28px",
      display: "inline-block",
      boxShadow: "rgb(0 0 0 / 40%) 0px 0px 2px",
    },
  };

  const backgroundColorStyle = colorStyles[color] || {
    boxShadow: "rgb(0 0 0 / 40%) 0px 0px 5px",
    background: "#f57c00",
  };

  const emptyColorStyle = emptyStyles[color] || {};

  const displayNumber = number || number === 0 ? number : "?";

  return (
    <div className="grid justify-center w-[10%] p-[1px] mb-2">
      <div
        className="inline-block text-white text-center leading-7 h-7 w-[28px] rounded-[50%]"
        style={backgroundColorStyle}
      >
        <div className="" style={emptyColorStyle}></div>
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
    return number; // Return an empty string if color is empty or unknown
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
    background: "#000000",
  };

  const displayValue = color ? getColorLetter() : number;

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

function MyOrder({ period, select, result, amount }) {
  const getColorLetter = (value) => {
    switch (value) {
      case "green":
        return "G";
      case "red":
        return "R";
      case "violet":
        return "V";
      default:
        return "";
    }
  };

  const getBackgroundColorStyle = (value) => {
    const colorStyles = {
      red: {
        boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 5px",
        background: "#fa3c09",
      },
      green: {
        boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 5px",
        background: "#00c282",
      },
      violet: {
        boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 5px",
        background: "#6655d3",
      },
      "violet-green": {
        boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 5px",
        background: "#00c282",
      },
      "violet-red": {
        boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 5px",
        background: "#fa3c09",
      },
    };

    return (
      colorStyles[value] || {
        boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 5px",
        background: "#000000",
      }
    );
  };

  const getEmptyColorStyle = (value) => {
    const emptyStyles = {
      "violet-green": {
        backgroundColor: "rgb(102, 85, 211)",
        position: "absolute",
        width: "14px",
        borderRadius: "0 15px 15px 0",
        color: "white",
        textAlign: "center",
        height: "28px",
        display: "inline-block",
        boxShadow: "rgb(0, 0, 0, 0.4) 0px 0px 2px",
      },
      "violet-red": {
        backgroundColor: "rgb(102, 85, 211)",
        position: "absolute",
        width: "14px",
        borderRadius: "0 15px 15px 0",
        color: "white",
        textAlign: "center",
        height: "28px",
        display: "inline-block",
        boxShadow: "rgb(0, 0, 0, 0.4) 0px 0px 2px",
      },
    };

    return emptyStyles[value] || {};
  };

  const displayNumber = result[1] !== "undefined" ? result[1] : "?";
  const displayValue = select ? getColorLetter(select) : "";

  return (
    <>
      <div className="flex flex-wrap pt-2 pb-2 h-12 leading-8">
        <div className="inline-block flex-[26.85%] text-left">{period}</div>
        {/* This shows select */}
        <div className="inline-block flex-[12.08%]">
          <span
            className="inline-block text-white text-center leading-7 h-7 w-[28px] rounded-[50%]"
            style={getBackgroundColorStyle(select)}
          >
            {displayValue}
          </span>
        </div>
        <div className="inline-block flex-[15.44%]">Point</div>
        {/* this show result */}
        <div className="inline-block flex-[12.08%]">
          <div
            className="inline-block text-white text-center leading-7 h-7 w-[28px] rounded-[50%]"
            style={getBackgroundColorStyle(result[0])}
          >
            <div className="" style={getEmptyColorStyle(result[0])}></div>
            <div className="relative">{displayNumber}</div>
          </div>
        </div>
        <div className="inline-block flex-[33.55%] tet-right">₹{amount}</div>
      </div>
    </>
  );
}

export default SpareParity;
