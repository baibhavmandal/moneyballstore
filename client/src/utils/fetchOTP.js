import axios from "axios";

// Function to send OTP to the client
async function sendOTPToClient(mobilenumber) {
  try {
    const response = await axios.post("/api/send-otp", {
      mobilenumber,
    });

    return response;
  } catch (error) {
    console.error("Error during OTP sending:", error);
  }
}

export { sendOTPToClient };
