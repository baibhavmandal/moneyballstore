import React from "react";

export default function RechargeHeader({ balance }) {
  return (
    <header className="flex-[0_0_100%] max-w-[100%] w-full px-4 relative">
      <div class="whitespace-nowrap flex flex-wrap items-center text-white text-base leading-10 h-11 sticky top-0 bg-[#06d6a0]">
        <div class="flex-[0_0_25%] text-left text-sm w-full max-w-[25%] px-4">
          <span onclick="rclist()">Records</span>
        </div>
        <div class="flex-[0_0_50%] text-lg font-bold w-full max-w-[50%] px-4">
          Recharge
        </div>
        <div class="flex-[0_0_25%] text-sm text-right w-full max-w-[25%] px-4">
          <span onclick="rchl()">Help</span>
        </div>
      </div>
      <div class="flex flex-wrap justify-center">
        <div class="flex-[0_0_100%] text-center w-full max-w-[100%] mt-4 px-4">
          <div class="text-base text-center text-[#979797] m-2">Balance</div>
          <div class="text-xl text-[#383b45] font-bold">
            ₹
            <span class="text-2xl" id="u_bal">
              {balance}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
