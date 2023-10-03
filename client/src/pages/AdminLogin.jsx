import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import AuthHeader from "../components/AuthHeader";
import imgUrl from "../assets/moneyball.png";

const AdminLogin = () => {
  return (
    <div className="col-lg-4 col-md-6 text-center h-full w-full px-4 fixed overflow-scroll">
      <AuthHeader text="Admin Login" />
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
};

function RegistrationForm() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
    otp: "",
  });

  const navigate = useNavigate(); // Use useNavigate instead
  const [cookies, setCookie, removeCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]); // Initialize cookies
  const token = cookies.crazygames_auth; // Read 'token' cookie
  const userId = cookies.crazygames_userId; // Read 'userId' cookie

  // Check if the cookie exists and navigate to user page if it does
  useEffect(() => {
    if (token && userId) {
      navigate(`/admin/home`);
    } else {
      if (token) removeCookie("crazygames_auth", { path: "/" });
      if (userId) removeCookie("crazygames_userId", { path: "/" });
    }
  }, []);

  const isFormValid = () => {
    return (
      formData.mobileNumber &&
      formData.password &&
      formData.otp &&
      formData.mobileNumber.length == 10
    );
  };

  async function handleSendOTP(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/send-otp",
        {
          mobilenumber: formData.mobileNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      alert("Error sending OTP");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/admin/adminLogin",
        {
          mobilenumber: formData.mobileNumber,
          password: formData.password,
          otp: formData.otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Get the current time in milliseconds
      const currentTime = new Date().getTime();

      // Calculate the time 1 hour from now (in milliseconds)
      const oneHourFromNow = currentTime + 3600000;

      // Store the token in cookie
      setCookie("crazygames_auth", response.data.token, {
        path: "/",
        expires: new Date(oneHourFromNow),
      });

      // Store the userId in cookie
      setCookie("crazygames_userId", response.data.userId, {
        path: "/",
        expires: new Date(oneHourFromNow),
      });

      if (response.data.message === "Login successful") navigate(`/admin/home`);
    } catch (error) {
      alert("Error registering user");
    }
  };

  return (
    <div className="flex-[0_0_100%] w-full max-w-[100%] px-4 relative">
      <form className="flex flex-wrap m-0 mr-0 pt-1" onSubmit={handleSubmit}>
        <div className="flex-[0_0_100%] flex items-center h-14 w-full max-w-[100%] p-0 bg-white">
          <span className="inline-block text-center h-5 min-w-[50px] p-3 bg-contain bg-phone bg-no-repeat bg-center"></span>
          <input
            className="text-lg h-fit w-full border-none p-3"
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            placeholder="Enter Mobile Number"
            onChange={handleChange}
          />
        </div>
        <div className="flex-[0_0_100%] flex items-center h-14 w-full max-w-[100%] p-0 bg-white">
          <span className="inline-block text-center h-5 min-w-[50px] p-3 bg-contain bg-lock bg-no-repeat bg-center"></span>
          <input
            className="text-lg h-fit w-full border-none p-3"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Passowrd (>6 characters)"
            onChange={handleChange}
          />
        </div>
        <div className="flex-[0_0_100%] flex items-center h-14 w-full max-w-[100%] p-0 bg-white">
          <span className="inline-block text-center h-5 min-w-[50px] p-3 bg-contain bg-react bg-no-repeat bg-center"></span>
          <input
            className="text-lg h-fit w-full border-none p-3"
            type="text"
            name="otp"
            value={formData.otp}
            placeholder="Enter OTP"
            onChange={handleChange}
          />
          <button
            className="basis-1/4 text-lg leading-10 font-medium text-white w-full rounded-xl ml-2 bg-green-600"
            onClick={handleSendOTP}
          >
            OTP
          </button>
        </div>
        <div className="hidden text-left flex-[0_0_100%] w-full max-w-[100%] p-0 relative"></div>
        <div className="text-base text-left flex-[0_0_100%] w-full max-w-[100%]  text-gray-800 mx-2 pt-1 p-0"></div>
        <div className="flex-[0_0_100%] w-full max-w-[100%] mb-4 mt-2 p-0 relative"></div>
        <div className="flex-[0_0_100%] w-full max-w-[100%] mb-4 mt-2 p-0 relative">
          <button
            className={
              isFormValid()
                ? "btn text-lg leading-10 font-semibold text-white w-full rounded-xl bg-[#06d6a0]"
                : "btn text-lg leading-10 font-semibold text-white w-full rounded-xl bg-[#888888]"
            }
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;
