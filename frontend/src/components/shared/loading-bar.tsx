import React from "react";

const LoadingBar: React.FC = () => {
  return (
    <div className="w-[810px] min-h-screen mx-auto flex justify-center items-center">
      <div className="relative w-full h-2 bg-gray-200 overflow-hidden">
        <div className="absolute h-full bg-green-500 animate-loading-bar"></div>
      </div>
    </div>
  );
};

export default LoadingBar;
