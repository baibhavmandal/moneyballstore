import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import { fetchUserMobileNumber } from "../utils/fetchUserData";
import { RightArrowSVG } from "../assets/RightArrowSVG";
import { SupportSVG } from "../assets/SupportSVG";
import { TelegramSVG } from "../assets/TelegramSVG";
import { FinancialSVG } from "../assets/FinancialSVG";
import { OrderSVG } from "../assets/OrderSVG";

export default function Profile() {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]);
  const token = cookies.crazygames_auth || ""; // Read 'token' cookie with a default value
  const userId = cookies.crazygames_userId || ""; // Read 'userId' cookie with a default value
  const [id, setID] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    if (!token || !userId) {
      // Delete cookies and redirect to login page if token is missing
      if (token) removeCookie("crazygames_auth", { path: "/" });
      if (userId) removeCookie("crazygames_userId", { path: "/" });
      navigate("/auth/login");
      return;
    }

    fetchMobileNumber();
  }, [userId, token, navigate, removeCookie]);

  const fetchMobileNumber = async () => {
    const data = await fetchUserMobileNumber(userId, token);
    setMobileNumber(data.mobileNumber);
  };

  const handleSignOut = () => {
    // Remove cookies and redirect to login page
    console.log("Before cookies removal:", document.cookie);
    if (token) removeCookie("crazygames_auth", { path: "/" });
    if (userId) removeCookie("crazygames_userId", { path: "/" });
    // Log cookies after removal
    console.log("After cookies removal:", document.cookie);
    navigate("/auth/login");
  };

  useEffect(() => {
    if (userId) {
      const parts = userId.split("-"); // Split the userId based on '-'
      setID(parts[parts.length - 1]);
    }
  }, [userId]);

  return (
    <div className="col-lg-4 col-md-6 text-center h-full w-full bg-white fixed overflow-scroll">
      <div className="flex flex-wrap">
        <ProfileHeader id={id} mobileNumber={mobileNumber} />
        <ProfileBody />
        <div className="flex flex-wrap w-full mt-14 p-0">
          <div
            className="flex-[0_0_100%] text-center w-full max-w-[100%] pt-3 pb-3 px-4 relative unLine mcpl cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

function ProfileHeader({ id, mobileNumber }) {
  return (
    <header className="flex-[0_0_100%] h-20 w-full max-w-[100%] mb-3 p-4 relative bg-[#06d6a0]">
      <div className="flex flex-wrap items-center text-[#333] min-h-[100px] w-full mt-4 mb-1 border border-solid border-[#d0ebff] rounded bg-[#f9fcff]">
        <div
          class="flex-[0_0_16.666667%] text-center w-full max-w-[16.666667%] px-4 relative"
          id="u_pic"
        >
          <span class="inline-flex h-10 min-w-[42px] border border-solid border-[#888] rounded-[50%] bg-contain bg-inherit bg-profile"></span>
        </div>
        <div class="flex-[0_0_83.333333%] text-left w-full max-w-[83.333333%] px-4 relative">
          <div class="text-xl">
            <span id="u_nam">{mobileNumber}</span>
          </div>
          <div class="text-xs pt-1">
            Mob:
            <span className="text-[#959ea6]" id="u_mob">
              {mobileNumber}
            </span>
            , ID:
            <span className="text-[#959ea6]" id="u_id">
              {id}
            </span>
          </div>
          <div class="infob" onclick="infob()"></div>
        </div>
        <div className="flex[0_0_100%] max-w-[100%] flex items-center w-full px-4 pt-2">
          <div className="whitespace-nowrap h-10 ml-1 px-1 border border-solid border-[#06d6a0] leading-10 bg-white text-[#06d6a0] text-sm rounded">
            Change Password
          </div>
        </div>
      </div>
    </header>
  );
}

function ProfileBody() {
  const navigate = useNavigate();

  const styleLogo = "h-7 min-w-[28px] ml-1 mr-3 inline-block align-bottom";
  const styleRow1 =
    "flex-[0_0_100%] max-w-[100%] w-full border border-solid border-white py-4 pr-2 pl-0 relative";
  const styleRow2 =
    "flex-[0_0_100%] max-w-[100%] w-full py-4 pr-2 pl-0 relative";
  const styleArrowRight =
    "inline-block h-3 min-w-[20px] ml-1 align-middle mt-2 bg-contain float-right";

  return (
    <div className="flex-[0_0_100%] max-w-[100%] w-full mt-6 mb-14 p-0 pb-6 text-base relative">
      <div className="flex flex-wrap m-0 mt-6 mr-0 border-b border-solid border-white px-4 pt-2 text-left">
        <div className={styleRow1}>
          <span
            className={styleLogo}
            onClick={() => navigate("/auth/user/orders")}
          >
            <OrderSVG />
          </span>
          <span
            className="leading-7"
            onClick={() => navigate("/auth/user/orders")}
          >
            Order Record
          </span>
          <span
            className={styleArrowRight}
            onClick={() => navigate("/auth/user/orders")}
          >
            <RightArrowSVG />
          </span>
        </div>
        <div className={styleRow2}>
          <span
            className={styleLogo}
            onClick={() => navigate("/auth/user/financial")}
          >
            <FinancialSVG />
          </span>
          <span
            className="leading-7"
            onClick={() => navigate("/auth/user/financial")}
          >
            Financial Details
          </span>
          <span
            className={styleArrowRight}
            onClick={() => navigate("/auth/user/financial")}
          >
            <RightArrowSVG />
          </span>
        </div>
      </div>
      <div className="flex flex-wrap m-0 mr-0 border-b border-solid border-white px-4 text-left">
        <div className={styleRow1}>
          <span className={styleLogo}>
            <TelegramSVG />
          </span>
          <span className="leading-7">Follwo Us</span>
          <span className={styleArrowRight}>
            <RightArrowSVG />
          </span>
        </div>
        <div className={styleRow2}>
          <span className={styleLogo}>
            <SupportSVG />
          </span>
          <span className="leading-7">Support</span>
          <span className={styleArrowRight}>
            <RightArrowSVG />
          </span>
        </div>
      </div>
    </div>
  );
}
