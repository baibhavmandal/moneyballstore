import React from "react";

function OrdersHeader() {
  return (
    <div className="flex-[0_0_100%] max-w-[100%] w-full px-4">
      <div className="flex flex-wrap pb-2">
        <div className="flex-[0_0_100%] flex text-base max-w-[100%] w-full px-4 pb-3 pt-2 relative">
          <HeaderItem text="Period" width="[26.85%]" />
          <HeaderItem text="Select" width="[12.08%]" />
          <HeaderItem text="Point" width="[15.44%]" />
          <HeaderItem text="Result" width="[12.08%]" />
          <HeaderItem text="Amount" width="[33.55%]" />
        </div>
      </div>
    </div>
  );
}

function HeaderItem({ text, width }) {
  return <div className={`inline-block flex-${width} text-left`}>{text}</div>;
}

export default OrdersHeader;
