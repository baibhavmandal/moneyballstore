import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import QR2000 from "../assets/QR-2000.jpeg";
import QR1500 from "../assets/QR-1500.jpeg";
import QR1000 from "../assets/QR-1000.jpeg";
import QR500 from "../assets/QR-500.jpeg";
import QROther from "../assets/QR-Other.jpeg";

function MakePayment() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]);
  const token = cookies.crazygames_auth;
  const userId = cookies.crazygames_userId;
  const { amount } = useParams();
  const [formData, setFormData] = useState({
    userId: userId,
    amount: amount,
    transactionId: "",
  });

  let selectedImage;

  // Conditionally set the selected image based on the 'amount' parameter
  if (amount === "2000") {
    selectedImage = QR2000;
  } else if (amount === "1500") {
    selectedImage = QR1500;
  } else if (amount === "1000") {
    selectedImage = QR1000;
  } else if (amount === "500") {
    selectedImage = QR500;
  } else {
    selectedImage = QROther;
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/payment/recharge",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      // Handle success
      alert("Payment created successfully!");

      setTimeout(() => {
        navigate(`/auth/user`);
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token || !userId) {
      // Delete Cookie
      removeCookie("crazygames_auth");
      removeCookie("crazygames_userId");
      navigate("/auth/login"); // Redirect to login page if token is missing
      return;
    }
    console.log(formData);
    console.log(amount);
  }, [formData]);

  return (
    <div className="bg-green-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="container mx-auto bg-white p-8 rounded-lg shadow-md text-center"
      >
        <h1 className="text-green-700 text-3xl font-semibold">
          Payment of {amount}
        </h1>
        <div className="mt-4 h-80 w-80">
          <img src={selectedImage} alt={`QR Code for ${amount}`} />
        </div>
        <div className="input-container mt-4 text-left">
          <label
            htmlFor="transactionId"
            className="block text-green-700 font-semibold mb-1"
          >
            Transaction ID:
          </label>
          <input
            type="text"
            id="transactionId"
            name="transactionId"
            className="w-full px-3 py-2 border-2 border-green-600 rounded-md focus:outline-none focus:border-green-800 text-lg"
            placeholder="Enter Transaction ID"
            onChange={handleInputChange}
            required
          />
        </div>
        <button
          id="done-button"
          type="submit"
          className="bg-green-600 text-white px-5 py-3 rounded-md text-xl mt-4 hover:bg-green-700 transition duration-300"
        >
          Done
        </button>
      </form>
    </div>
  );
}

export default MakePayment;
