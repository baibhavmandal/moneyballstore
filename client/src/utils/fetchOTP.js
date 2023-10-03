import axios from "axios";

import baseURL from "../baseURL";

// Create an Axios instance with a custom configuration
const apiInstance = axios.create({
  baseURL,
});

// Function to send OTP to the client
async function sendOTPToClient(mobilenumber) {
  try {
    const response = await apiInstance.post("/api/v1/auth/send-otp", {
      mobilenumber,
    });

    return response;
  } catch (error) {
    console.error("Error during OTP sending:", error);
  }
}

export { sendOTPToClient };
