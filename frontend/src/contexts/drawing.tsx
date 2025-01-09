import {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import { Socket } from "socket.io-client";
import useSocket from "src/hooks/use-socket";
import { drawingService, GetDrawingsResponse } from "src/services/drawing";
import { useDebounce } from "src/hooks/use-debounce";
import { simplifyStrokes } from "src/utils/simplify";
import { Stroke } from "src/@types/drawing";
import { useAuthContext } from "./auth";
import { generateRandomColor } from "src/utils/colors";

type DrawingContextType = {
  strokeSize: number;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  setStrokeSize: (size: number) => void;
  socket: Socket | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleMouseMove: (event: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleTouchStart: (event: React.TouchEvent) => void;
  handleTouchMove: (event: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearCanvas: () => void;
};

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const useDrawingContext = () => {
  const context = useContext(DrawingContext);
  if (!context) {
    throw new Error("useDrawingContext must be used within a DrawingProvider");
  }
  return context;
};

export const DrawingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [strokeColor, setStrokeColor] = useState(generateRandomColor());
  const [strokeSize, setStrokeSize] = useState(2);

  const [allStrokes, setAllStrokes] = useState<Stroke[][]>([]);

  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);

  const canUndo = useMemo(() => undoStack.length > 0, [undoStack]);
  const canRedo = useMemo(() => redoStack.length > 0, [redoStack]);

  const socket: Socket | null = useSocket();

  const { user } = useAuthContext();

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
        setAllStrokes(drawings.map((d) => d.strokes));
        drawPreviousStrokes(drawings);
      } catch (error) {
        console.error("Failed to load drawings", error);
      }
    };

    fetchDrawings();
  }, []);

  const saveDrawing = () => {
    if (!socket || strokes.length === 0) return;

    socket.emit("saveDrawing", { strokes });
  };

  const debouncedSaveDrawing = useDebounce(saveDrawing, 300);

  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fbfff1";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const drawLogic = (data: Stroke) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
      debouncedSaveDrawing();
    }
  };

  const handleDrawFromServer = (data: Stroke) => {
    drawLogic(data);
  };

  const drawPreviousStrokes = (drawings: GetDrawingsResponse[]) => {
    drawings.forEach((drawing) => {
      drawing.strokes.forEach((stroke) => {
        drawLogic(stroke);
      });
    });
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allStrokes.forEach((strokesGroup) =>
      strokesGroup.forEach((stroke) => drawLogic(stroke))
    );
  };

  const handleUndo = () => {};

  const handleRedo = () => {};

  const emitStroke = (x: number, y: number, type: "begin" | "draw" | "end") => {
    if (!socket) return;

    const strokeData: Stroke = {
      x,
      y,
      type,
      strokeSize,
      strokeColor,
      userId: user!.id,
    };

    socket.emit("draw", strokeData);
    setStrokes((prevStrokes) => simplifyStrokes([...prevStrokes, strokeData]));
  };

  const getTouchPosition = (event: React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];

    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    if (!socket || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      setIsDrawing(true);
      const { x, y } = getTouchPosition(event);

      ctx.lineWidth = strokeSize;
      ctx.strokeStyle = strokeColor;
      ctx.beginPath();
      ctx.moveTo(x, y);

      emitStroke(x, y, "begin");
    }
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isDrawing || !socket || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const { x, y } = getTouchPosition(event);

      ctx.lineWidth = strokeSize;
      ctx.strokeStyle = strokeColor;
      ctx.lineTo(x, y);
      ctx.stroke();

      emitStroke(x, y, "draw");
    }
  };

  const handleTouchEnd = () => {
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
    if (!isDrawing) return;
    setIsDrawing(false);

    if (strokes.length > 0) {
      setAllStrokes((prev) => [...prev, strokes]);
      setUndoStack((prev) => [strokes, ...prev]);
      setStrokes([]);
      setRedoStack([]);
      debouncedSaveDrawing();
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

  return (
    <DrawingContext.Provider
      value={{
        strokeSize,
        strokeColor,
        setStrokeColor,
        setStrokeSize,
        socket,
        canvasRef,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleUndo,
        handleRedo,
        canUndo,
        canRedo,
        clearCanvas,
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};
