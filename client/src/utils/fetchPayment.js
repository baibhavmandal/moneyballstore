import axios from "axios";

// Define the base URL for your API
import baseURL from "../baseURL";

// Create an Axios instance with the base URL
const apiInstance = axios.create({
  baseURL,
});

// Function to create a recharge
async function createRecharge(userId, amount, transactionId, token) {
  try {
    const response = await apiInstance.post(
      "/api/v1/payment/createRecharg",
      {
        userId,
        amount,
        transactionId,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      console.log("Recharge created successfully:", data.message);
      return data.payment;
    } else {
      console.error("Error creating recharge:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error creating recharge:", error);
    return null;
  }
}

// Function to create a withdrawal
async function createWithdraw(userId, withdrawalAmount, bankDetails, token) {
  try {
    const response = await apiInstance.post(
      "/api/v1/payment/createWithdraw",
      {
        userId,
        withdrawalAmount,
        bankDetails,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      console.log("Withdrawal created successfully:", data.message);
      return data.payment;
    } else {
      console.error("Error creating withdrawal:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error creating withdrawal:", error);
    return null;
  }
}

export { createRecharge, createWithdraw };
