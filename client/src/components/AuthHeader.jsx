import React from "react";
import { useNavigate } from "react-router-dom";
import { LeftArrowSVG } from "../assets/LeftArrowSVG";

function AuthHeader({ text, url }) {
  const navigate = useNavigate();

  return (
    <header className="text-lg whitespace-nowrap text-white h-11 w-full max-w-full px-4 sticky top-0 bg-[#06d6a0]">
      <div className="flex flex-wrap h-full w-full">
        <div className="basis-1/5 text-left leading-10 h-full w-full max-w-[17%] px-4 relative">
          <span
            className="inline-flex align-text-top text-left h-6 w-6 cursor-pointer"
            onClick={() => navigate(url)}
          >
            <LeftArrowSVG />
          </span>
        </div>
        <div className="basis-3/5 items-center leading-10 font-semibold h-full w-full max-w-[66%] px-4 relative">
          {text}
        </div>
      </div>
    </header>
  );
}

export default AuthHeader;
