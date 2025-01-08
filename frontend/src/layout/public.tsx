import React from "react";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen flex bg-grass-100">
      <div className="basis-full hidden lg:flex bg-svg bg-no-repeat bg-center bg-cover"></div>
      <div className="basis-full flex items-center">
        <Outlet />
      </div>
    </div>
  );
}

export default PublicLayout;
