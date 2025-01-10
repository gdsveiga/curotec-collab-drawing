import React from "react";
import { useDrawingContext } from "src/contexts/drawing";
import {
  ArrowArcLeft,
  ArrowArcRight,
  Download,
  File,
  SignOut,
  Users,
} from "@phosphor-icons/react";
import { cn } from "src/utils/classname";
import { useAuthContext } from "src/contexts/auth";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

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
    onlineUsers,
  } = useDrawingContext();

  const { logout } = useAuthContext();
  const navigate = useNavigate();

  return (
    <div className="fixed left-2 lg:left-auto lg:bottom-4 lg:max-w-[min(810px,100%)] lg:w-full z-20 flex lg:flex-row flex-col items-center lg:justify-between gap-4 lg:gap-0 bg-grass-800 lg:px-4 lg:py-2 p-2 rounded">
      <div className="flex lg:flex-row flex-col items-center gap-4">
        <div className="flex lg:flex-row flex-col items-center gap-2">
          <div
            data-tooltip-id="toolbar-tooltip"
            data-tooltip-content="Clear canvas"
            className="flex lg:flex-row flex-col items-center justify-center p-1 rounded bg-grass-500 text-grass-700 cursor-pointer "
            onClick={clearCanvas}
          >
            <File size={20} weight="bold" />
          </div>
          <div
            data-tooltip-id="toolbar-tooltip-users"
            className={
              "bg-grass-500 text-grass-700 cursor-pointer flex lg:flex-row flex-col items-center justify-center p-1 rounded "
            }
          >
            <Users size={20} weight="bold" />
          </div>
          <div
            data-tooltip-id="toolbar-tooltip"
            data-tooltip-content="Download"
            className={
              "bg-grass-500 text-grass-700 cursor-pointer flex lg:flex-row flex-col items-center justify-center p-1 rounded "
            }
            onClick={() => {
              downloadCanvas();
            }}
          >
            <Download size={20} weight="bold" />
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-1 items-center">
          <div
            data-tooltip-id="toolbar-tooltip"
            data-tooltip-content="Undo"
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
            data-tooltip-id="toolbar-tooltip"
            data-tooltip-content="Redo"
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
              data-tooltip-id="toolbar-tooltip"
              data-tooltip-content="Select color"
              type="color"
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
              data-tooltip-id="toolbar-tooltip"
              data-tooltip-content="Select brush size"
              type="range"
              min="2"
              max="20"
              value={strokeSize}
              onChange={(e) => setStrokeSize(Number(e.target.value))}
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
          data-tooltip-id="toolbar-tooltip"
          data-tooltip-content="Logout"
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
      <Tooltip id="toolbar-tooltip" className="!bg-grass-700 !text-grass-100" />
      <Tooltip
        id="toolbar-tooltip-users"
        className="!bg-grass-700 !text-grass-100"
      >
        <div className="flex flex-col gap-1">
          {onlineUsers.map((user) => (
            <div className="flex items-baseline gap-1 last-of-type:border-none last-of-type:pb-0 border-b border-b-grass-600 pb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {user.username}
            </div>
          ))}
        </div>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
