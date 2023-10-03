import axios from "axios";

import { generateOTP } from "../modules/miscModule.js";
import { updateOtpInStore, updateAdminOTP } from "../config/data.js";

const sendOTPToClient = async (req, res) => {
  try {
    const { mobilenumber } = req.body;

    // Generate OTP
    const otp = generateOTP();

    // Update OTP in storage
    updateOtpInStore(mobilenumber, otp);

    // Send OTP via Fast2SMS API
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        variables_values: otp,
        route: "otp",
        numbers: mobilenumber,
      },
      {
        headers: {
          Authorization:
            "CLvabIZNEBW9yoDdR3VmJp7itSekGXHcwAx0jOKsqTl6M5rhFnquYXiap4Z8rmR5kGVlwKtozvLbUEHJ", // Replace with your Fast2SMS API key
        },
      }
    );

    console.log(response.data);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending OTP" });
  }
};

const sendOTPToAdmin = async (req, res) => {
  try {
    const { mobilenumber } = req.body;

    // Generate OTP
    const otp = generateOTP();

    // Update OTP in storage
    updateAdminOTP(mobilenumber, otp);

    // Send OTP via Fast2SMS API
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        variables_values: otp,
        route: "otp",
        numbers: mobilenumber,
      },
      {
        headers: {
          Authorization:
            "CLvabIZNEBW9yoDdR3VmJp7itSekGXHcwAx0jOKsqTl6M5rhFnquYXiap4Z8rmR5kGVlwKtozvLbUEHJ", // Replace with your Fast2SMS API key
        },
      }
    );

    console.log(response.data);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error sending OTP" });
  }
};

export { sendOTPToClient, sendOTPToAdmin };
