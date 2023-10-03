import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LeftArrowSVG } from "../assets/LeftArrowSVG";

const Header = ({ onButtonClick, title, url }) => {
  const [buttonRuleClicked, setButtonRuleClicked] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/auth/user");
  };

  const handleRuleClick = () => {
    onButtonClick();
    console.log("clicked");
  };

  return (
    <header className="text-lg whitespace-nowrap text-white h-11 w-full max-w-full px-4 sticky top-0 bg-[#06d6a0]">
      <div className="flex flex-wrap h-full w-full">
        <div className="basis-1/5 text-left leading-10 h-full w-full max-w-[17%] px-4 relative">
          <span
            className="inline-flex align-text-top text-left h-6 w-6 cursor-pointer"
            onClick={handleNavigation}
          >
            <LeftArrowSVG />
          </span>
        </div>
        <div className="basis-3/5 items-center leading-10 font-semibold h-full w-full max-w-[66%] px-4 relative">
          {title}
        </div>
        <div
          className="basis-1/5 text-right leading-10 h-full w-full max-w-[17%] px-4 cursor-pointer relative font-semibold text-red-800"
          onClick={handleRuleClick}
        >
          Rule
        </div>
      </div>
    </header>
  );
};

export default Header;
