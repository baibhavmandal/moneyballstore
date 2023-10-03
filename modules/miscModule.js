// OTP Generator
import otpGenerator from "otp-generator";

const OTP_LENGTH = 6;
const OTP_CONFIG = {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
};

const generateOTP = () => {
  const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
  return OTP;
};

export { generateOTP };
