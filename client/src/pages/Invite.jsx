import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import InviteHeader from "../components/InviteHeader";
import Footer from "../components/Footer";

export default function Invite() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]);
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

  return (
    <div className="col-lg-4 col-md-6 text-center h-full w-full bg-white fixed overflow-scroll">
      <div className="flex flex-wrap">
        <InviteHeader />
        <ComponentOne />
        <ComponentTwo />
        <ComponentThree />
        <Footer />
      </div>
    </div>
  );
}

function ComponentOne() {
  return (
    <div class="flex-[0_0_100%] w-full max-w-[100%] mt-6 border-solid border-b-8 b-[#ededed] pt-6 pb-4 px-4 relative">
      <div class="flex flex-wrap text-center">
        <div
          class="flex-[0_0_50%] max-w-[50%] w-full border-r border-solid border-[#bababa] py-2 px-4 relative"
          onclick="ntpvl()"
        >
          Privilege
        </div>
        <div
          class="flex-[0_0_50%] max-w-[50%] w-full py-2 px-4 relative"
          onclick="ntmls()"
        >
          My Link
        </div>
      </div>
    </div>
  );
}

function ComponentTwo() {
  return (
    <div class="flex-[0_0_100%] w-full max-w-[100%] mt-2 border-b-8 border-solid border-[#ededed] px-4 relative">
      <div class="flex flex-wrap mt-2 mr-0 px-0 pt-4 pb-6">
        <div class="text-left flex-[0_0_50%] w-full max-w-[50%] px-4 relative">
          <div class="text-center w-fit cursor-pointer" onclick="invr()">
            <div class="text-sm text-[#979797]">Invited today</div>
            <div class="text-[#383b45] font-semibold mb-2 mt-2">
              <span class="text-2xl font-bold" id="u-int">
                0
              </span>
            </div>
            <div class="text-sm">
              Total:
              <span class="font-semibold pl-1 pr-2" id="u_into">
                0
              </span>
              <span class="goRight"></span>
            </div>
          </div>
        </div>
        <div class="text-right flex-[0_0_50%] justify-end w-full max-w-[50%] px-4 relative cursor-pointer">
          <div class="text-center w-fit cursor-pointer" onclick="dincr()">
            <div class="text-sm text-[#979797]">Today's income</div>
            <div class="text-[#383b45] font-semibold mb-2 mt-2">
              ₹
              <span class="text-2xl font-bold" id="u_tic">
                0.00
              </span>
            </div>
            <div class="text-sm">
              Total:
              <span class="font-semibold pl-1 pr-2" id="u_ttin">
                ₹0
              </span>
              <span class="goRight"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComponentThree() {
  return (
    <div class="flex-[0_0_100%] w-full max-w-[100%] mt-2 px-4 relative">
      <div class="flex flex-wrap whitespace-nowrap m-0 mt-2 mb-20 overflow-hidden">
        <div class="flex-[0_0_66.6666%] text-base text-[#383b45] text-left max-w-[66.666666%]">
          Recent Record(s)
        </div>
        <div class="flex-[0_0_33.333333%] text-[#979797] text-right w-full max-w-[33.33333333%] px-4 mb-2 relative">
          <span class="cursor-pointer" onclick="comr()">
            more&gt;
          </span>
        </div>
        <div
          class="flex-[0_0_100%] max-w-[100%] min-h-[180px] w-full px-4 pt-2 relative"
          id="insort"
        >
          <div class="text-[#979797] w-full max-w-[100%] pt-4 pxx-4 relative">
            <div class="text-sm pt-3">No records</div>
          </div>
        </div>
      </div>
    </div>
  );
}
