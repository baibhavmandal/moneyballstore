import axios from "axios";

// Define the base URL for your API
import baseURL from "../baseURL";

// Create an Axios instance with the base URL
const apiInstance = axios.create({
  baseURL,
});

// Function to log in an admin
async function adminLogin(mobilenumber, password, otp) {
  try {
    const response = await apiInstance.post("/api/v1/admin/adminLogin", {
      mobilenumber,
      password,
      otp,
    });

    if (response.status === 200) {
      const data = response.data;
      console.log(data.message); // Login successful message
      console.log("Admin ID:", data.adminId); // Admin ID
      console.log("Token:", data.token); // JWT token
    } else {
      console.error("Admin login failed");
    }
  } catch (error) {
    console.error("Error during admin login:", error);
  }
}

// Function to get all current orders for admin
async function getAllCurrentOrders(token) {
  try {
    const response = await apiInstance.post(
      "/api/v1/admin/getAllCurrentOrders",
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      console.log("Current Orders:", data.currentOrders);
    } else {
      console.error("Error fetching current orders");
    }
  } catch (error) {
    console.error("Error fetching current orders:", error);
  }
}

// Function to get recharge orders for admin
async function getRechargeOrders(token) {
  try {
    const response = await apiInstance.post(
      "/api/v1/admin/getRechargeOrders",
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      console.log("Recharge Orders:", data.rechargeOrders);
    } else {
      console.error("Error fetching recharge orders");
    }
  } catch (error) {
    console.error("Error fetching recharge orders:", error);
  }
}

// Function to get withdrawal orders for admin
async function getWithdrawOrders(token) {
  try {
    const response = await apiInstance.post(
      "/api/v1/admin/getWithdrawOrders",
      {},
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      console.log("Withdrawal Orders:", data.withdrawOrders);
    } else {
      console.error("Error fetching withdrawal orders");
    }
  } catch (error) {
    console.error("Error fetching withdrawal orders:", error);
  }
}

// Function to verify a recharge payment as an admin
async function verifyRecharge(token, approved, paymentDetails, amount, remark) {
  try {
    const response = await apiInstance.post(
      "/api/v1/admin/verifyPayment",
      {
        approved,
        paymentDetails,
        amount,
        remark,
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
      console.log(data.message);
    } else {
      console.error("Error verifying recharge payment");
    }
  } catch (error) {
    console.error("Error verifying recharge payment:", error);
  }
}

// Function to verify a withdrawal payment as an admin
async function verifyWithdrawal(token, approved, paymentDetails, remark) {
  try {
    const response = await apiInstance.post(
      "/api/v1/admin/verifyWithdrwal",
      {
        approved,
        paymentDetails,
        remark,
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
      console.log(data.message);
    } else {
      console.error("Error verifying withdrawal payment");
    }
  } catch (error) {
    console.error("Error verifying withdrawal payment:", error);
  }
}

export {
  adminLogin,
  getAllCurrentOrders,
  getRechargeOrders,
  getWithdrawOrders,
  verifyRecharge,
  verifyWithdrawal,
};
