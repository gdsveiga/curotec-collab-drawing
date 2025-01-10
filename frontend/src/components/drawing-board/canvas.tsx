import React from "react";
import { useDrawingContext } from "src/contexts/drawing";

const Canvas: React.FC = () => {
  const {
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    socket,
  } = useDrawingContext();

  if (!socket) {
    return (
      <div className="absolute -top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
        Loading...
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="cursor-crosshair touch-none"
    ></canvas>
  );
};

export default Canvas;
