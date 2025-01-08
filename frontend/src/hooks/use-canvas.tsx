import { useRef, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { Stroke } from "src/@types/drawing";
import { useDrawingContext } from "src/contexts/drawing";
import simplify from "simplify-js";
import { drawingService, GetDrawingsResponse } from "src/services/drawing";

const useCanvas = (socket: Socket | null) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const { strokeSize, strokeColor } = useDrawingContext();

  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleDrawFromServer = (data: {
    x: number;
    y: number;
    type: string;
    strokeSize: number;
    strokeColor: string;
  }) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = data.strokeSize;
        ctx.strokeStyle = data.strokeColor;

        if (data.type === "begin") {
          ctx.beginPath();
          ctx.moveTo(data.x, data.y);
        } else if (data.type === "draw") {
          ctx.lineTo(data.x, data.y);
          ctx.stroke();
        } else if (data.type === "end") {
          ctx.closePath();
          saveDrawing();
        }
      }
    }
  };

  const drawPreviousStrokes = (drawings: GetDrawingsResponse[]) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawings.forEach((drawing) => {
          drawing.strokes.forEach((stroke) => {
            ctx.lineWidth = stroke.strokeSize;
            ctx.strokeStyle = stroke.strokeColor;

            if (stroke.type === "begin") {
              ctx.beginPath();
              ctx.moveTo(stroke.x, stroke.y);
            } else if (stroke.type === "draw") {
              ctx.lineTo(stroke.x, stroke.y);
              ctx.stroke();
            } else if (stroke.type === "end") {
              ctx.closePath();
            }
          });
        });
      }
    }
  };

  useEffect(() => {
    if (!socket) {
      console.warn("Socket is not initialized.");
      return;
    }

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    socket.on("draw", handleDrawFromServer);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      socket.off("draw", handleDrawFromServer);
    };
  }, [socket]);

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const drawings = await drawingService.getDrawings();
        drawPreviousStrokes(drawings);
      } catch (error) {
        console.error("Failed to load drawings", error);
      }
    };

    fetchDrawings();
  }, []);

  const emitStroke = (x: number, y: number, type: "begin" | "draw" | "end") => {
    if (!socket) return;

    const strokeData = {
      x,
      y,
      type,
      strokeSize,
      strokeColor,
    };

    socket.emit("draw", strokeData);
    setStrokes((prevStrokes) => [...prevStrokes, strokeData]);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!socket || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      setIsDrawing(true);
      const { clientX, clientY } = event;

      ctx.lineWidth = strokeSize;
      ctx.strokeStyle = strokeColor;
      ctx.beginPath();
      ctx.moveTo(clientX, clientY);

      emitStroke(clientX, clientY, "begin");
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDrawing || !socket || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const { clientX, clientY } = event;

      ctx.lineWidth = strokeSize;
      ctx.strokeStyle = strokeColor;
      ctx.lineTo(clientX, clientY);
      ctx.stroke();

      emitStroke(clientX, clientY, "draw");
    }
  };

  const handleMouseUp = () => {
    if (!socket || !isDrawing) return;

    setIsDrawing(false);

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.closePath();
        emitStroke(0, 0, "end");
        saveDrawing();
      }
    }
  };

  const clearCanvas = () => {
    if (!socket || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    socket.emit("clearCanvas");
  };

  const saveDrawing = () => {
    if (!socket || strokes.length === 0) return;

    const simplifiedPoints = simplify(
      strokes.map((s) => ({ x: s.x, y: s.y })),
      1
    );

    const simplifiedStrokes = simplifiedPoints.map((point, index) => {
      const originalStroke = strokes.find(
        (s) => s.x === point.x && s.y === point.y
      );
      return {
        x: point.x,
        y: point.y,
        type: index === 0 ? "begin" : "draw",
        strokeSize: originalStroke?.strokeSize || 2,
        strokeColor: originalStroke?.strokeColor || "#000000",
      };
    });

    if (simplifiedStrokes.length > 0) {
      simplifiedStrokes[simplifiedStrokes.length - 1].type = "end";
    }

    socket.emit("saveDrawing", { strokes: simplifiedStrokes });
  };

  return {
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    clearCanvas,
  };
};

export default useCanvas;
