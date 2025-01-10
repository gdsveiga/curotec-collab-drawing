import React from "react";
import { useDrawingContext } from "src/contexts/drawing";
import {
  ArrowArcLeft,
  ArrowArcRight,
  Download,
  File,
  SignOut,
} from "@phosphor-icons/react";
import { cn } from "src/utils/classname";
import { useAuthContext } from "src/contexts/auth";
import { useNavigate } from "react-router-dom";

const Toolbar: React.FC = () => {
  const {
    strokeColor,
    strokeSize,
    setStrokeColor,
    setStrokeSize,
    clearCanvas,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    downloadCanvas,
  } = useDrawingContext();

  const { logout } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div className="fixed left-2 lg:left-auto lg:bottom-4 lg:max-w-[min(810px,100%)] lg:w-full z-20 flex lg:flex-row flex-col items-center lg:justify-between gap-4 lg:gap-0 bg-grass-800 lg:px-4 lg:py-2 p-2 rounded">
      <div className="flex lg:flex-row flex-col items-center gap-4">
        <div
          title="Clear canvas"
          className="flex lg:flex-row flex-col items-center justify-center p-1 rounded bg-grass-500 text-grass-700 cursor-pointer "
          onClick={clearCanvas}
        >
          <File size={20} weight="bold" />
        </div>
        <div className="flex lg:flex-row flex-col gap-1 items-center">
          <div
            title="Undo"
            className={cn(
              canUndo
                ? "bg-grass-700 text-white cursor-pointer"
                : "bg-neutral-700 text-neutral-400 cursor-not-allowed",
              "flex items-center justify-center p-1 rounded "
            )}
            onClick={handleUndo}
          >
            <ArrowArcLeft size={20} weight="bold" />
          </div>
          <div
            title="Redo"
            className={cn(
              canRedo
                ? "bg-grass-700 text-white cursor-pointer"
                : "bg-neutral-700 text-neutral-400 cursor-not-allowed",
              "flex items-center justify-center p-1 rounded "
            )}
            onClick={handleRedo}
          >
            <ArrowArcRight size={20} weight="bold" />
          </div>
        </div>
        <div className="flex lg:flex-row flex-col items-center lg:gap-8 gap-2">
          <div className="flex lg:flex-row flex-col items-center gap-2">
            <input
              type="color"
              title="Select color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="bg-grass-800 border-none rounded w-8 h-8"
            />
            <div className="text-grass-200 text-sm lg:inline hidden">
              {strokeColor}
            </div>
          </div>
          <div className="flex lg:flex-row flex-col items-center gap-2">
            <input
              type="range"
              min="2"
              max="20"
              value={strokeSize}
              onChange={(e) => setStrokeSize(Number(e.target.value))}
              title="Select brush size"
              className="accent-grass-500 [writing-mode:vertical-lr] lg:[writing-mode:lr]"
            />
            <div className="text-grass-200 text-sm lg:inline hidden">
              {strokeSize}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center lg:flex-row flex-col  gap-2">
        <div
          title="Logout"
          className={
            "bg-grass-500 text-grass-700 cursor-pointer flex lg:flex-row flex-col items-center justify-center p-1 rounded "
          }
          onClick={() => {
            downloadCanvas();
          }}
        >
          <Download size={20} weight="bold" />
        </div>
        <div
          title="Logout"
          className={
            "bg-grass-500 text-grass-700 cursor-pointer flex lg:flex-row flex-col items-center justify-center p-1 rounded "
          }
          onClick={() => {
            navigate("/login");
            logout();
          }}
        >
          <SignOut size={20} weight="bold" />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
