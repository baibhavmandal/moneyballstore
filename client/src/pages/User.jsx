import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import Footer from "../components/Footer";
import imgUrlFastParity from "../assets/FAST-PARITY.png";
import imgUrlEasyParity from "../assets/EASY-PARITY.png";
import imgUrlSpareParity from "../assets/SPARE-PARITY.png";
import imgUrlReferral from "../assets/Referral.png";
import imgUrlReload from "../assets/reload.svg";
import { fetchUserBalance } from "../utils/fetchUserData";

const User = () => {
  // Get the userId param from the URL
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState();

  const [cookies, setCookie, removeCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]);
  const token = cookies.crazygames_auth; // Read 'token' cookie
  const userId = cookies.crazygames_userId; // Read 'userId' cookie
  const [id, setID] = useState("");
  const [isShadowVisible, setIsShadowVisible] = useState(false);

  const fetchBalance = async () => {
    try {
      const { balance } = await fetchUserBalance(userId, token);
      setUserBalance(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleRefreshClick = () => {
    fetchBalance();
    setIsShadowVisible(true);
    setTimeout(() => {
      setIsShadowVisible(false);
    }, 500);
  };

  useEffect(() => {
    if (!token || !userId) {
      // Delete Cookie
      removeCookie("crazygames_auth");
      removeCookie("crazygames_userId");
      navigate("/auth/login"); // Redirect to login page if token is missing
      return;
    }
  }, [token, userId, navigate, removeCookie]);

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    if (userId) {
      const parts = userId.split("-"); // Split the userId based on '-'
      setID(parts[parts.length - 1]);
    }
  }, [userId]);

  return (
    <div className="col-lg-4 col-md-6 w-full h-full px-4 bg-white fixed overflow-scroll">
      <div className="flex flex-wrap mt-4">
        <div className="flex-[0_0_100%] w-full px-4 max-w-[100%] relative">
          <div className="items-center flex flex-wrap h-32 m-0 mt-4">
            <div className="flex-[0_0_50%] text-left w-full max-w-[50%] px-4 relative">
              <div className="text-base text-gray-600 mt-1 mb-2">Balance</div>
              <div className="flex items-center text-lg font-semibold mt-1 mb-2">
                ₹
                <span className="text-xl text-black font-bold">
                  {userBalance}
                </span>
                <span
                  className={`ml-2 ${
                    isShadowVisible ? "box-shadow-bottom" : ""
                  }`}
                  onClick={handleRefreshClick}
                >
                  <img className="" id="" src={imgUrlReload} />
                </span>
              </div>
              <div className="text-base text-gray-600 mt-1">ID:{id}</div>
            </div>
            <div className="flex-[0_0_50%] grid justify-end pr-1 w-full max-w-[50%]">
              <button className="text-center text-base text-white font-semibold h-10 px-2 bg-[#06d6a0] rounded-xl cursor-pointer">
                <Link to="/auth/recharge">Recharge</Link>
              </button>
              <button className="text-center text-base text-gray-600 font-semibold h-10 mt-3 bg-gray-200 cursor-pointer">
                <Link to="/auth/withdraw">Withdraw</Link>
              </button>
            </div>
          </div>
        </div>
        <div className="flex-[0_0_100%] w-full mx-w-full mb-14 px-4">
          <div className="flex flex-wrap text-sm font-bold text-gray-950 pb-4 pt-3">
            <div className="flex-[0_0_100%] justify-center items-center w-full mx-w-full my-2 px-2">
              <img
                className="w-full rounded-lg bg-contain"
                src={imgUrlReferral}
                alt="Can't load image"
              />
            </div>
            <div className="flex-[0_0_50%] w-full max-w-[50%] px-2 relative">
              <div className="whiteapce-nowrap text-sm text-left w-fit rounded-lg cursor-pointer">
                <Link to="/auth/games/easyparity">
                  <img
                    className="w-full rounded-lg bg-contain"
                    src={imgUrlEasyParity}
                    alt="Can't load image"
                  />
                </Link>
              </div>
            </div>
            <div className="flex-[0_0_50%] w-full max-w-[50%] px-2 relative">
              <div className="whiteapce-nowrap text-sm text-left w-fit rounded-lg cursor-pointer">
                <Link to="/auth/games/fastparity">
                  <img
                    className="w-full rounded-lg bg-contain"
                    src={imgUrlFastParity}
                    alt="Can't load image"
                  />
                </Link>
              </div>
            </div>
            <div className="flex-[0_0_50%] w-full max-w-[50%] mt-2 px-2 relative">
              <div className="whiteapce-nowrap text-sm text-left w-fit rounded-lg cursor-pointer">
                <Link to="/auth/games/spareparity">
                  <img
                    className="w-full rounded-lg bg-contain"
                    src={imgUrlSpareParity}
                    alt="Can't load image"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Outlet />
    </div>
  );
};

export default User;
