import React, { useEffect } from "react";
import { useCookies } from "react-cookie";

import AuthHeader from "../components/AuthHeader";
import RegistrationForm from "../components/RegistrationForm";
import imgUrl from "../assets/moneyball.png";

function CreateAccount() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]);
  const token = cookies.crazygames_auth; // Read 'token' cookie
  const userId = cookies.crazygames_userId; // Read 'userId' cookie

  // Run the effect after the initial render
  useEffect(() => {
    if (token && userId) {
      navigate(`/auth/user`);
    } else {
      removeCookie("crazygames_auth");
      removeCookie("crazygames_userId");
    }
  }, []);
  return (
    <div className="col-lg-4 col-md-6 text-center h-full w-full px-4 fixed overflow-scroll">
      <AuthHeader text="Create Account" />
      <div className="flex flex-wrap">
        <div className="flex-[0_0_100%] text-center w-full max-w-[100%] px-4 pt-6 required">
          <img
            className="m-auto"
            src={imgUrl}
            alt="Can't load image"
            height="56"
          />
        </div>
        <div className="flex-[0_0_100%] w-full max-w-[100%] px-4 realtive">
          <div className="flex flex-wrap">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
