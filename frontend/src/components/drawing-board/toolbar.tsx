import React from "react";
import { useDrawingContext } from "src/contexts/drawing";
import {
  ArrowArcLeft,
  ArrowArcRight,
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
  } = useDrawingContext();

  const { logout } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 max-w-[calc(100%-4rem)] lg:max-w-[min(810px,100%)] w-full z-20 flex items-center justify-between bg-grass-800 px-4 py-2 rounded">
      <div className="flex items-center gap-4">
        <div
          title="Clear canvas"
          className="flex items-center justify-center p-1 rounded bg-grass-500 text-grass-700 cursor-pointer "
          onClick={clearCanvas}
        >
          <File size={20} weight="bold" />
        </div>
        <div className="flex gap-1 items-center">
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
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <input
              type="color"
              title="Select color"
              value={strokeColor}
              onChange={(e) => setStrokeColor(e.target.value)}
              className="bg-grass-800 border-none rounded"
            />
            <div className="text-grass-200 text-sm">{strokeColor}</div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="2"
              max="20"
              value={strokeSize}
              onChange={(e) => setStrokeSize(Number(e.target.value))}
              title="Select brush size"
              className="accent-grass-500"
            />
            <div className="text-grass-200 text-sm">{strokeSize}</div>
          </div>
        </div>
      </div>

      <div
        title="Redo"
        className={
          "bg-grass-500 text-grass-700 cursor-pointer flex items-center justify-center p-1 rounded "
        }
        onClick={() => {
          navigate("/login");
          logout();
        }}
      >
        <SignOut size={20} weight="bold" />
      </div>
    </div>
  );
};

export default Toolbar;
