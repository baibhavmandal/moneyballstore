import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const RequestPayment = () => {
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
    withdrawalAmount: amount,
    bankDetails: {
      accountNumber: "",
      ifscCode: "",
      upiDetails: "",
      recipientName: "",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the server with the form data
      const response = await axios.post(
        "http://localhost:8000/api/v1/payment/withdraw",
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

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      bankDetails: {
        ...prevFormData.bankDetails,
        [name]: value,
      },
    }));
    console.log(formData);
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
  }, [FormData]);

  return (
    <div className="bg-gray-200 min-h-screen flex justify-center items-center">
      {/* UPI Withdraw Form */}
      <div className="container bg-white p-8 mx-4 md:max-w-md md:p-12 rounded-lg shadow-lg">
        <h1 className="text-center text-green-500 text-2xl font-semibold mb-6">
          Withdraw Money
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="upiDetails" className="block font-semibold">
              UPI:
            </label>
            <input
              type="text"
              id="upiDetails"
              name="upiDetails"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              onChange={handleBankDetailsChange}
              value={formData.bankDetails.upiDetails}
              required
            />
          </div>
          <button
            type="submit"
            id="withdraw-button"
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition duration-300"
          >
            Withdraw Request
          </button>
          <p className="text-center text-green-500 italic mt-4">
            You will receive your money within 2 hours.
          </p>
        </form>
      </div>

      {/* Divider */}
      <div className="divider my-8">
        <p>OR</p>
      </div>

      {/* Bank Details Form */}
      <div className="container bg-white p-8 mx-4 md:max-w-md md:p-12 rounded-lg shadow-lg">
        <h1 className="text-center text-blue-500 text-2xl font-semibold mb-6">
          Bank Details
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="accountNumber" className="block font-semibold">
              Account Number:
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              onChange={handleBankDetailsChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ifscCode" className="block font-semibold">
              IFSC Code:
            </label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              onChange={handleBankDetailsChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="recipientName" className="block font-semibold">
              Recipient's Name:
            </label>
            <input
              type="text"
              id="recipientName"
              name="recipientName"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
              onChange={handleBankDetailsChange}
            />
          </div>
          <input
            type="submit"
            id="withdraw-button"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition duration-300 block mx-auto mt-6"
            value="Withdraw Request"
          />
          <p className="text-center text-green-500 italic mt-4">
            You will receive your money within 24 hours.
          </p>
        </form>
      </div>
    </div>
  );
};

export default RequestPayment;
