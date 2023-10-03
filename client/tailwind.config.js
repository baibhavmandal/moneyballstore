/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "back-button": "url(./assets/Back-Btn.jpeg)",
        lock: "url(./assets/lock.svg)",
        phone: "url(./assets/phone.svg)",
        react: "url(./assets/react.svg)",
        "left-arrow-simple": "url(./assets/right-arrow.svg)",
        home: "url(./assets/home.svg)",
        invite: "url(./assets/invite.svg)",
        recharge: "url(./assets/recharge.svg)",
        profile: "url(./assets/profile.svg)",
      },
      colors: {
        "custom-green": "06d6a0",
      },
      customModal: {
        background: "white",
        maxWidth: "100%",
        width: "auto",
        padding: "20px",
        position: "fixed",
        top: "100vh",
        left: "0",
        right: "0",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
