import axios from "axios";

// Define the base URL for your API
import baseURL from "../baseURL";

// Create an Axios instance with the base URL
const apiInstance = axios.create({
  baseURL,
});

// Function to fetch user data from a specific route
async function fetchUserData(route, userId, token) {
  try {
    const response = await apiInstance.post(
      route,
      {
        userId,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 401) {
      // Handle token invalidation or redirection as needed
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to fetch all user information
async function fetchAllUserInfo(userId, token) {
  return await fetchUserData("/api/v1/user/all", userId, token);
}

// Function to fetch user's mobile number
async function fetchUserMobileNumber(userId, token) {
  return await fetchUserData("/api/v1/user/mobilenumber", userId, token);
}

// Function to fetch user's total bets
async function fetchUserTotalBets(userId, token) {
  return await fetchUserData("/api/v1/user/totalbets", userId, token);
}

// Function to fetch user's balance
async function fetchUserBalance(userId, token) {
  return await fetchUserData("/api/v1/user/balance", userId, token);
}

// Function to fetch user's payments
async function fetchUserPayments(userId, token) {
  return await fetchUserData("/api/v1/user/payments", userId, token);
}

// Function to fetch user's orders
async function fetchUserOrders(userId, token) {
  return await fetchUserData("/api/v1/user/orders", userId, token);
}

// Function to fetch user's top orders
async function fetchUserTopOrders(userId, token) {
  return await fetchUserData("/api/v1/user/toporders", userId, token);
}

export {
  fetchAllUserInfo,
  fetchUserMobileNumber,
  fetchUserTotalBets,
  fetchUserBalance,
  fetchUserPayments,
  fetchUserOrders,
  fetchUserTopOrders,
};
