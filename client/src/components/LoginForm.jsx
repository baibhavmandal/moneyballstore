import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { loginUser } from "../utils/fetchAuthData";

function LoginForm() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]);

  const token = cookies.crazygames_auth || "";
  const userId = cookies.crazygames_userId || "";

  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });

  useEffect(() => {
    if (token && userId) {
      navigate(`/auth/user`);
    }
  }, [token, userId, navigate]);

  const fetchData = async (mobileNumber, password) => {
    try {
      const data = await loginUser(mobileNumber, password);
      return data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

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
      const data = await fetchData(formData.mobileNumber, formData.password);

      const currentTime = new Date().getTime();
      const oneHourFromNow = currentTime + 3600000;

      setCookie("crazygames_auth", data.token, {
        path: "/",
        expires: new Date(oneHourFromNow),
      });

      setCookie("crazygames_userId", data.userId, {
        path: "/",
        expires: new Date(oneHourFromNow),
      });

      if (data.message === "Login successful") {
        navigate(`/auth/user`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error during login: ${error.message}`);
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
        <div className="hidden text-left flex-[0_0_100%] w-full max-w-[100%] p-0 relative"></div>
        <div className="text-base text-left flex-[0_0_100%] w-full max-w-[100%]  text-gray-800 mx-2 pt-1 p-0"></div>
        <div className="flex-[0_0_100%] w-full max-w-[100%] mb-4 mt-2 p-0 relative">
          <button
            className="text-lg leading-10 font-semibold text-white w-full rounded-xl bg-[#06d6a0]"
            type="submit"
          >
            Login
          </button>
        </div>
        <div className="flex-[0_0_50%] w-full max-w-[50%] mb-3 mt-3 p-0 relative">
          <button
            className="whitespace-nowrap text-sm leading-10 text-[#06d6a0] h-12 w-full border border-solid border-[#06d6a0] rounded-md bg-white cursor-pointer"
            onClick={() => navigate("/auth/createaccount")}
          >
            Create an account
          </button>
        </div>
        <div className="whitespace-nowrap flex-[0_0_50%] text-right w-full max-w-[50%] pl-4 pr-0 pt-3 pb-2 relative">
          <button
            className="text-sm leading-10 text-[#06d6a0] h-12 w-full border border-solid border-[#06d6a0] rounded-md bg-white cursor-pointer"
            onClick={() => navigate("/auth/forgetpassword")}
          >
            Forget Password?
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
