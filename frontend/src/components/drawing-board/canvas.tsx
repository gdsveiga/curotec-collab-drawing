import React from "react";
import { useDrawingContext } from "src/contexts/drawing";

const Canvas: React.FC = () => {
  const { canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, socket } =
    useDrawingContext();

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseUp}
      className=" cursor-crosshair rounded-t-lg"
    ></canvas>
  );
};

export default Canvas;
