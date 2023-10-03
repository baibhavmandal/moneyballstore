import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import RechargeHeader from "../components/RechargeHeader";
import Footer from "../components/Footer";

export default function Recharge({ balance }) {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]);
  const [inputValue, setInputValue] = useState("");
  const token = cookies.crazygames_auth;
  const userId = cookies.crazygames_userId;

  useEffect(() => {
    if (!token || !userId) {
      // Delete Cookie
      removeCookie("crazygames_auth");
      removeCookie("crazygames_userId");
      navigate("/auth/login"); // Redirect to login page if token is missing
      return;
    }
  }, []);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    console.log(newValue);
  };

  const handlePriceClick = (event) => {
    const clickedPrice = event.target.textContent; // Get the text content of the clicked <div>
    // Remove the rupee sign and any non-numeric characters
    const numericValue = clickedPrice.replace(/[^0-9]/g, "");
    setInputValue(numericValue); // Set the clicked price as the input value
  };

  const handleRechargeClick = () => {
    // Convert inputValue to a number
    const inputValueAsNumber = parseFloat(inputValue);

    if (isNaN(inputValueAsNumber) || inputValueAsNumber < 500) {
      // Display an alert message to the user
      alert("Invalid input. Please enter a valid amount of 500 or more.");
    } else {
      // Navigate to the desired URL when the condition is met
      navigate(`/auth/recharge/makepayment/${inputValueAsNumber}`);
    }
  };

  return (
    <div className="col-lg-4 col-md-6 text-center w-full h-full bg-white fixed overflow-scroll">
      <div className="flex flex-wrap" id="warea">
        <RechargeHeader balance={balance} />
        <div className="flex-[0_0_100%] max-w-[100%] py-4 px-7">
          <div className="text-xl text-left font-semibold text-[#383b45]">
            Amount
          </div>
          <div className="flex items-center text-black h-16 w-full border-b-2 border-solid border-[#cccccc] p-0 bg-white">
            <span className="inline-block text-center text-3xl text-[#383b45] pr-3">
              ₹
            </span>
            <input
              type="tel"
              className="text-4xl w-full h-16 m-0 border-none p-2 pl-0 bg-none overflow-visible"
              maxLength="10"
              placeholder="500 ~ 100000"
              autoComplete="off"
              onKeyDown="rcenk()"
              id="rcamt"
              fdprocessedid="rraavgk"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-wrap mt-3 h-6" id="rcblt"></div>
          <div className="flex flex-wrap mt-5" id="alst">
            {/* Map through the price options and create a <div> for each */}
            {["₹500", "₹1500", "₹4000", "₹20000", "₹30000", "₹40000"].map(
              (price, index) => (
                <div
                  key={index}
                  className="flex-[0_0_33.333333%] w-full max-w-[33.3333333%] px-1 relative"
                >
                  <div
                    className="leading-10 text-black h-10 mb-3 rounded-md bg-[#ebf7ff] cursor-pointer"
                    id={index + 1}
                    onClick={handlePriceClick} // Attach the click event handler
                  >
                    {price}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="mt-2 mb-2 p-0">
            <div
              className="leading-10 text-lg text-white font-semibold rounded-lg bg-[#06d6a0] pointer-events-auto cursor-pointer"
              onClick={handleRechargeClick} // Use onClick for event handling
            >
              Recharge
            </div>
          </div>
          <div className="text-base text-[#979797] mt-6" id="rcann"></div>
        </div>
      </div>
      <div className="flex flex-wrap" id="odrea"></div>
      <Footer />
    </div>
  );
}
