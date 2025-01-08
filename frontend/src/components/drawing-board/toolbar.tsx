import React from "react";
import { useDrawingContext } from "src/contexts/drawing";
import { ArrowArcLeft, ArrowArcRight, File } from "@phosphor-icons/react";
import { cn } from "src/utils/classname";

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

  return (
    <div className="fixed bottom-4 w-[calc(100%-4rem)] lg:w-[calc(100%-20rem)] z-20 flex items-center gap-4 bg-stone-800 px-4 py-2 rounded">
      <div
        title="Clear canvas"
        className="flex items-center justify-center p-1 rounded bg-emerald-600 cursor-pointer  text-white"
        onClick={clearCanvas}
      >
        <File size={20} weight="bold" />
      </div>
      <div className="flex gap-1 items-center">
        <div
          title="Undo"
          className={cn(
            canUndo
              ? "bg-emerald-800 text-white cursor-pointer"
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
              ? "bg-emerald-800 text-white cursor-pointer"
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
            className="bg-stone-800 border-none rounded"
          />
          <div className="text-white text-sm">{strokeColor}</div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="2"
            max="20"
            value={strokeSize}
            onChange={(e) => setStrokeSize(Number(e.target.value))}
            title="Select brush size"
          />
          <div className="text-white text-sm">{strokeSize}</div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
