import React from "react";

export default function InviteHeader() {
  return (
    <header className="flex-[0_0_100%] h-20 w-full max-w-[100%] mb-3 p-4 relative bg-[#06d6a0]">
      <div className="flex flex-wrap items-center text-[#333] min-h-[100px] w-full mt-4 mb-1 border border-solid border-[#d0ebff] rounded bg-[#f9fcff]">
        <div class="flex-[0_0_50%] text-left max-w-[50%] px-4 relative">
          <div class="text-sm text-[#979797] mb-2">Agent amount</div>
          <div class="font-semibold text-[#383b45] mb-2 mt-1">
            ₹
            <span class="text-2xl font-bold" onclick="addBTWFrm()" id="u_com">
              0.00
            </span>
          </div>
        </div>
        <div className="flex-[0_0_50%] grid items-center justify-end w-full max-w-[50%] pt-2 pr-2 pb-2 pl-4 relative">
          <div
            class="wdcom flex items-center justify-center text-center text-white font-bold h-12 min-w-[120px] mb-1 rounded-md py-0 px-3 bg-green-700 cursor-pointer"
            onclick="wdcom()"
          >
            Withdraw
          </div>
        </div>
      </div>
    </header>
  );
}
