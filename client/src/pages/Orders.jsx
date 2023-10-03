import React, { useState, useEffect } from "react";
import AuthHeader from "../components/AuthHeader";
import OrdersHeader from "../components/OrdersHeader";
import { fetchUserOrders } from "../utils/fetchUserData";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import ListOrders from "../components/ListOrders";

export default function Orders() {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies([
    "crazygames_auth",
    "crazygames_userId",
  ]);
  const token = cookies.crazygames_auth || ""; // Read 'token' cookie with a default value
  const userId = cookies.crazygames_userId || ""; // Read 'userId' cookie with a default value
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token || !userId) {
      // Delete cookies and redirect to login page if token is missing
      if (token) removeCookie("crazygames_auth", { path: "/" });
      if (userId) removeCookie("crazygames_userId", { path: "/" });
      navigate("/auth/login");
      return;
    }
    fetchOrders();
  }, [userId, token, navigate, removeCookie]);

  const fetchOrders = async () => {
    const data = await fetchUserOrders(userId, token);
    setOrders(data.orders);
    console.log(data.orders.length);
    console.log(orders);
  };

  return (
    <div className="col-lg-4 col-md-6 w-full h-full px-4 bg-white fixed overflow-scroll">
      <div className="flex flex-wrap">
        <AuthHeader text="Orders" url="/auth/user/profile" />
        <OrdersHeader />
        {orders.map((order, index) => (
          <ListOrders key={index} order={order} />
        ))}
      </div>
    </div>
  );
}
