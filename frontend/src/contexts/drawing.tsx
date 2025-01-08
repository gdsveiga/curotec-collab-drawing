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
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeSize, setStrokeSize] = useState(2);

  const [allStrokes, setAllStrokes] = useState<Stroke[][]>([]);

  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);

  const canUndo = useMemo(() => undoStack.length > 0, [undoStack]);
  const canRedo = useMemo(() => redoStack.length > 0, [redoStack]);

  const socket: Socket | null = useSocket();

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

  const debouncedSaveDrawing = useDebounce(saveDrawing, 500);

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

  const handleUndo = () => {
    if (!canUndo) return;

    setAllStrokes((prev) => {
      const lastStrokes = prev[prev.length - 1];
      setRedoStack((redo) => [lastStrokes, ...redo]);
      return prev.slice(0, -1);
    });

    redrawCanvas();
  };

  const handleRedo = () => {
    if (!canRedo) return;

    setRedoStack((prev) => {
      const lastRedo = prev[0];
      setAllStrokes((strokes) => [...strokes, lastRedo]);
      return prev.slice(1);
    });

    redrawCanvas();
  };

  const emitStroke = (x: number, y: number, type: "begin" | "draw" | "end") => {
    if (!socket) return;

    const strokeData: Stroke = {
      x,
      y,
      type,
      strokeSize,
      strokeColor,
    };

    socket.emit("draw", strokeData);
    setStrokes((prevStrokes) => simplifyStrokes([...prevStrokes, strokeData]));
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
