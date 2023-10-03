import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import User from "./pages/User";
import FastParity from "./pages/FastParity";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import ForgetPassword from "./pages/ForgetPassword";
import Recharge from "./pages/Recharge";
import Invite from "./pages/Invite";
import EasyParity from "./pages/EasyParity";
import Profile from "./pages/Profile";
import Withdraw from "./pages/Withdraw";
import MakePayment from "./pages/MakePayment";
import RequestPayment from "./pages/RequestPayment";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import Orders from "./pages/Orders";
import Financial from "./pages/Financial";
import SpareParity from "./pages/SpareParity";

const App = () => {
  const userId = "12345";
  const balance = 100.0;

  return (
    <div className="app text-center box-border">
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route
              path="/auth/user"
              element={<User userId={userId} balance={balance} />}
            />
            <Route path="/auth/user/profile" element={<Profile />} />
            <Route path="/auth/user/orders" element={<Orders />} />
            <Route path="/auth/user/financial" element={<Financial />} />
            <Route path="/auth/createaccount" element={<CreateAccount />} />
            <Route path="/auth/forgetpassword" element={<ForgetPassword />} />
            <Route path="/auth/games/fastparity" element={<FastParity />} />
            <Route path="/auth/games/easyparity" element={<EasyParity />} />
            <Route path="/auth/games/spareparity" element={<SpareParity />} />
            <Route
              path="/auth/recharge"
              element={<Recharge balance={balance} />}
            />
            <Route
              path="/auth/withdraw"
              element={<Withdraw balance={balance} />}
            />
            <Route path="/auth/invite" element={<Invite balance={balance} />} />
            <Route
              path="/auth/recharge/makepayment/:amount"
              element={<MakePayment />}
            />
            <Route
              path="/auth/withdraw/requestpayment/:amount"
              element={<RequestPayment />}
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/home" element={<AdminHome />} />
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </div>
  );
};

export default App;
