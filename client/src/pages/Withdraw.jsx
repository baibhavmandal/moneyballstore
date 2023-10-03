import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import WithdrawHeader from "../components/WithdrawHeader";

export default function Withdraw({ balance }) {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]);
  const [inputValue, setInputValue] = useState("");
  const token = cookies.crazygames_auth; // Read 'token' cookie
  const userId = cookies.crazygames_userId; // Read 'userId' cookie
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

  const handleRechargeClick = () => {
    // Convert inputValue to a number
    const inputValueAsNumber = parseFloat(inputValue);

    // Check if inputValue is NaN or less than 500
    if (isNaN(inputValueAsNumber) || inputValueAsNumber < 500) {
      // Display an alert message to the user
      alert("Invalid input. Please enter a valid amount of 500 or more.");
    } else {
      // Navigate to the desired URL when the condition is met
      navigate(`/auth/withdraw/requestpayment/${inputValueAsNumber}`);
    }
  };

  return (
    <div className="col-lg-4 col-md-6 w-full">
      <WithdrawHeader balance={balance}></WithdrawHeader>
      <div class="flex-[0_0_100%] max-w-[100%] py-4 px-7">
        <div class="text-xl text-left font-semibold text-[#383b45]">Amount</div>
        <div class="flex items-center text-black h-16 w-full border-b-2 border-solid border-[#cccccc] p-0 bg-white">
          <span class="inline-block text-center text-3xl text-[#383b45] pr-3">
            ₹
          </span>
          <input
            type="tel"
            class="text-4xl w-full h-16 m-0 border-none p-2 pl-0 bg-none overflow-visible"
            maxlength="10"
            placeholder="500 ~ 10000"
            autocomplete="off"
            onkeydown="rcenk()"
            id="rcamt"
            fdprocessedid="rraavgk"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        <div class="flex flex-wrap whitespace-nowrap text-left text-[#979797] text-sm">
          <div class="flex-[0_0_50%] w-full max-w-[50%] px-4 pt-2 relative">
            Amount &lt; ₹<span id="wdw">1000</span>,fee ₹
            <span id="wdx">30</span>
          </div>
          <div class="flex-[0_0_50%] text-right w-full max-w-[50%] px-4 pt-2 relative">
            Maximum:<span id="mwa">₹10000</span>
          </div>
          <div class="flex-[0_0_50%] w-full max-w-[50%] px-4 pt-2 relative">
            Amount&gt;=₹<span id="wdy">1000</span>,fee <span id="wdz">3</span>%
          </div>
          <div class="flex-[0_0_50%] text-right w-full max-w-[50%] px-4 pt-2 relative">
            Minimum:<span id="mwda">₹700</span>
          </div>
        </div>
        <div class="mt-2 mb-2 p-0">
          <div
            class="leading-10 text-lg text-white font-semibold rounded-lg bg-[#06d6a0] pointer-events-auto cursor-pointer"
            onClick={handleRechargeClick}
          >
            Withdraw
          </div>
        </div>
        <div class="text-base text-[#979797] mt-6" id="rcann"></div>
      </div>
    </div>
  );
}
