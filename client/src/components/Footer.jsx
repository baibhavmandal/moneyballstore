import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex flex-wrap w-full max-w-[100%] fixed bottom-0">
      <div className="col-lg-4 col-md-6 flex-[0_0_100%] text-[#89cdff] max-w-[100%] px-4 pb-3 border border-solid border-[#f5f5f5] bg-white">
        <div className="flex flex-wrap">
          <div class="flex-[0_0_25%] w-full max-w-[25%] p-0 realtive">
            <div
              class="text-[#06d6a0] h-12 mt-2 mx-3 p-1"
              id="moxht2b4u"
              onclick="home()"
            >
              <div class="text-center">
                <Link to="/auth/user">
                  <span class="block align-middle h-8 bg-home bg-no-repeat bg-center"></span>
                </Link>
              </div>
              <div class="text-center text-sm">
                <Link to="/auth/user">Home</Link>
              </div>
            </div>
          </div>
          <div class="flex-[0_0_25%] w-full max-w-[25%] p-0 realtive">
            <div
              class="text-[#06d6a0] h-12 mt-2 mx-3 p-1"
              id="moxht2b4u"
              onclick="home()"
            >
              <div class="text-center">
                <Link to="/auth/invite">
                  <span class="block align-middle h-8 bg-invite bg-no-repeat bg-center"></span>
                </Link>
              </div>
              <div class="text-center text-sm">
                <Link to="/auth/invite">Invite</Link>
              </div>
            </div>
          </div>
          <div class="flex-[0_0_25%] w-full max-w-[25%] p-0 realtive">
            <div
              class="text-[#06d6a0] h-12 mt-2 mx-3 p-1"
              id="moxht2b4u"
              onclick="home()"
            >
              <div class="text-center">
                <Link to="/auth/recharge">
                  <span class="block align-middle h-8 bg-recharge bg-no-repeat bg-center"></span>
                </Link>
              </div>
              <div class="text-center text-sm">
                <Link to="/auth/recharge">Recharge</Link>
              </div>
            </div>
          </div>
          <div class="flex-[0_0_25%] w-full max-w-[25%] p-0 realtive">
            <div
              class="text-[#06d6a0] h-12 mt-2 mx-3 p-1"
              id="moxht2b4u"
              onclick="home()"
            >
              <div class="text-center">
                <Link to="/auth/user/profile">
                  <span class="block align-middle h-8 bg-profile bg-no-repeat bg-center"></span>
                </Link>
              </div>
              <div class="text-center text-sm">
                <Link to="/auth/user/profile">My Profile</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </footer>
  );
}
