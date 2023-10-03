import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { sendOTPToClient } from "../utils/fetchOTP";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
    otp: "",
  });

  const navigate = useNavigate();
  const [cookies] = useCookies(["crazygames_auth", "crazygames_userId"]);

  const token = cookies.crazygames_auth || "";
  const userId = cookies.crazygames_userId || "";

  useEffect(() => {
    if (token && userId) {
      navigate(`/auth/user`);
    }
  }, [token, userId, navigate]);

  const isFormValid = () => {
    return (
      formData.mobileNumber &&
      formData.password &&
      formData.otp &&
      formData.password.length >= 6 &&
      formData.mobileNumber.length == 10
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleSendOTP(e) {
    e.preventDefault();

    if (formData.mobileNumber.length !== 10) {
      alert("Enter a valid mobile number");
      return;
    }

    try {
      const response = await sendOTPToClient(formData.mobileNumber);
      alert(response.data.message);
    } catch (error) {
      alert("Error sending OTP");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please fill all fields correctly");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/register",
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

      if (response.data.message === "User registered successfully") {
        // Registration successful, redirect to login page
        alert(response.data.message);
        navigate("/auth/login");
      } else {
        // Display other messages in an alert
        alert(response.data.message);
      }
    } catch (error) {
      alert("Error registering user");
    }
  };

  return (
    <div className="flex-[0_0_100%] w-full max-w-[100%] px-4 realtive">
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
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegistrationForm;
