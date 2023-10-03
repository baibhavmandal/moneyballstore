import React from "react";
import AuthHeader from "../components/AuthHeader";
import LoginForm from "../components/LoginForm";
import imgUrl from "../assets/moneyball.png";

const Login = () => {
  return (
    <div className="col-lg-4 col-md-6 text-center h-full w-full px-4 fixed overflow-scroll">
      <AuthHeader text="Login" />
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
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
