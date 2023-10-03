import axios from "axios";

// Create an Axios instance with a custom configuration
const apiInstance = axios.create({
  baseURL: "http://localhost:8000",
});

// Function to register a user
async function registerUser(mobilenumber, password, otp) {
  try {
    const response = await apiInstance.post("/api/v1/auth/register", {
      mobilenumber,
      password,
      otp,
    });

    if (response.status === 200) {
      const data = response.data;
      alert(data.message); // Registration successful message
    } else {
      console.error("Registration failed");
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

// Function to log in a user
async function loginUser(mobilenumber, password) {
  try {
    const response = await apiInstance.post("/api/v1/auth/login", {
      mobilenumber,
      password,
    });

    if (response.status === 200) {
      const data = response.data;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
}

// Function to reset the password after receiving OTP
async function resetPassword(mobilenumber, otp, newPassword) {
  try {
    const response = await apiInstance.post("/api/v1/auth/reset-password", {
      mobilenumber,
      otp,
      newPassword,
    });

    if (response.status === 200) {
      const data = response.data;
      console.log(data.message); // Password reset successful message
    } else {
      console.error("Password reset failed");
    }
  } catch (error) {
    console.error("Error during password reset:", error);
  }
}

export { registerUser, loginUser, resetPassword };
