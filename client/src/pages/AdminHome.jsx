import React, { useState } from "react";

const AdminHome = () => {
  const [showOrder, setShowOrder] = useState("recharge"); // Default to "Everyone's Order"

  const handleToggleOrder = (orderType) => {
    setShowOrder(orderType);
  };

  return (
    <div className="col-lg-4 col-md-6">
      <div className="flex flex-wrap mt-2 border-t-2 border-t-slate-200">
        <div
          className={`flex-[0_0_33.333333%] min-w-[33.333333%] w-full font-semibold pt-4 px-4 tabin active rounded-t-6 h-12 whitespace-nowrap leading-48 transition duration-200 cursor-pointer overflow-hidden text-lg mt-[-10px] bg-white relative ${
            showOrder === "recharge"
              ? "text-black border-3 border-b-blue-500"
              : "text-slate-400"
          }`}
          id="vevod"
          onClick={() => handleToggleOrder("recharge")}
        >
          Recharge Order
        </div>
        <div
          className={`flex-[0_0_33.333333%] min-w-[33.333333%] w-full font-semibold pt-4 px-4 tabin active rounded-t-6 h-12 whitespace-nowrap leading-48 transition duration-200 cursor-pointer overflow-hidden text-lg mt-[-10px] bg-white relative ${
            showOrder === "withdraw"
              ? "text-black border-3 border-b-blue-500"
              : "text-slate-400"
          }`}
          id="vmyod"
          onClick={() => handleToggleOrder("withdraw")}
        >
          Withdraw Order
        </div>
        <div
          className={`flex-[0_0_33.333333%] min-w-[33.333333%] w-full font-semibold pt-4 px-4 tabin active rounded-t-6 h-12 whitespace-nowrap leading-48 transition duration-200 cursor-pointer overflow-hidden text-lg mt-[-10px] bg-white relative ${
            showOrder === "all"
              ? "text-black border-3 border-b-blue-500"
              : "text-slate-400"
          }`}
          id="vothersod"
          onClick={() => handleToggleOrder("all")}
        >
          All Orders
        </div>
        {showOrder === "recharge" && (
          <div
            className="flex-[0_0_100%] text-[#666] w-full max-w-[100%] min-h-[428px] px-4 bg-white relative"
            id="ev"
          >
            <div className="flex flex-wrap">
              <div className="flex-[0_0_33.333333%] max-w-[33.3333333%] w-full px-4 relative text-base text-left pt-2">
                Transaction Id
              </div>
              <div className="flex-[0_0_26%] max-w-[26%] w-full px-4 relative text-base pt-2 xtr">
                Amount
              </div>
              <div className="flex-[0_0_20%] max-w-[20%] w-full px-4 relative text-base pt-2">
                Approve
              </div>
              <div className="flex-[0_0_20%] max-w-[20%] w-full px-4 relative text-base pt-2">
                Deny
              </div>
            </div>
            <Recharge />
            <Recharge />
          </div>
        )}
        {showOrder === "withdraw" && (
          <div className="flex-[0_0_100%] max-w-[100%] w-full px-4" id="order">
            <div className="flex flex-wrap">
              <div className="flex-[0_0_33.333333%] max-w-[33.3333333%] w-full px-4 relative text-base text-left pt-2">
                Bank Details
              </div>
              <div className="flex-[0_0_26%] max-w-[26%] w-full px-4 relative text-base pt-2 xtr">
                Amount
              </div>
              <div className="flex-[0_0_20%] max-w-[20%] w-full px-4 relative text-base pt-2">
                Approve
              </div>
              <div className="flex-[0_0_20%] max-w-[20%] w-full px-4 relative text-base pt-2">
                Deny
              </div>
            </div>
          </div>
        )}
        {showOrder === "all" && (
          <div className="flex-[0_0_100%] max-w-[100%] w-full px-4" id="order">
            <div className="flex flex-wrap">
              <div className="flex-[0_0_33.333333%] max-w-[33.3333333%] w-full px-4 relative text-base text-left pt-2">
                Order Name
              </div>
              <div className="flex-[0_0_26%] max-w-[26%] w-full px-4 relative text-base pt-2 xtr">
                Amount
              </div>
              <div className="flex-[0_0_20%] max-w-[20%] w-full px-4 relative text-base pt-2">
                Status
              </div>
              <div className="flex-[0_0_20%] max-w-[20%] w-full px-4 relative text-base pt-2">
                Deny
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Recharge = () => {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="flex-[0_0_100%] max-w-[100%] w-full px-4">
          <div className="flex flex-wrap w-full border py-2">
            <div className="flex-[0_0_33.333333%] max-w-[33.3333333%] w-full px-4 relative text-base text-left pt-2">
              Transaction Id
            </div>
            <div className="flex-[0_0_26%] max-w-[26%] w-full px-4 relative text-base pt-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Amount"
              />
            </div>
            <div className="flex-[0_0_20%] max-w-[20%] w-full px-4 relative text-base pt-2">
              <button className="btn text-white w-full h-9 rounded bg-[#06d6a0]">
                Approve
              </button>
            </div>
            <div className="flex-[0_0_20%] max-w-[20%] w-full px-4 relative text-base pt-2">
              <button className="btn text-white w-full h-9 rounded bg-red-500">
                Deny
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;
