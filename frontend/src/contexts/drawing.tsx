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
  downloadCanvas: () => void;
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

  const [myDrawings, setMyDrawings] = useState<Stroke[][]>([]);
  const [userDrawings, setUserDrawings] = useState<{
    [id: string]: Stroke[][];
  } | null>(null);

  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);

  const canUndo = useMemo(() => myDrawings.length > 0, [myDrawings]);
  const canRedo = useMemo(() => redoStack.length > 0, [redoStack]);

  const socket: Socket | null = useSocket();

  const { user } = useAuthContext();

  useEffect(() => {
    if (!socket) {
      console.warn("Socket is not initialized.");
      return;
    }

    socket.on("draw", (data) => {
      drawLogic(data);
    });
    socket.on("saveDrawing", (data) => {
      setUserDrawings((prev) => {
        return {
          ...prev,
          [data.userId]: [
            ...(prev?.[data.userId] || []),
            data.strokes.map((s: Stroke) => ({ ...s, id: data.id })),
          ],
        };
      });
    });
    socket.on("undo", (data) => {
      const updatedUserDrawings: { [id: string]: Stroke[][] } = {
        ...userDrawings,
        [data.userId]:
          userDrawings?.[data.userId]?.filter(
            (_, index) => index !== data.drawingId
          ) || [],
      };

      setUserDrawings(updatedUserDrawings);
      if (!socket || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fbfff1";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      console.log("cleaning Canvas");

      Object.values(updatedUserDrawings).map((userAllDrawings: Stroke[][]) =>
        userAllDrawings.map((drawing: Stroke[]) =>
          drawing.map((stroke) => drawLogic(stroke))
        )
      );
    });
    socket.on("clearCanvas", () => {
      if (!socket || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fbfff1";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      console.log("cleaning Canvas");
    });

    return () => {
      socket.off("draw", drawLogic);
    };
  }, [socket]);

  useEffect(() => {
    const fetchDrawings = async () => {
      try {
        const drawings = await drawingService.getDrawings();

        drawings.forEach((drawing) => {
          if (drawing.userId === user!.id) {
            setMyDrawings((prev) => [
              ...prev,
              drawing.strokes.map((s) => ({ ...s, id: drawing._id })),
            ]);
          } else {
            setUserDrawings((prev) => ({
              ...prev,
              [drawing.userId]: [
                ...(prev?.[drawing.userId] || []),
                drawing.strokes.map((s: Stroke) => ({ ...s, id: drawing._id })),
              ],
            }));
          }
        });

        drawPreviousStrokes(drawings);
      } catch (error) {
        console.error("Failed to load drawings", error);
      }
    };

    setCanvasSize();

    window.addEventListener("resize", setCanvasSize);

    setTimeout(() => fetchDrawings(), 100);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, [canvasRef.current]);

  const saveDrawing = () => {
    if (!socket || strokes.length === 0) return;

    socket.emit("saveDrawing", { userId: user!.id, strokes });
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

  const drawPreviousStrokes = (drawings: GetDrawingsResponse[]) => {
    console.log("desenhando do server", drawings);
    drawings.forEach((drawing) => {
      drawing.strokes.forEach((stroke) => {
        drawLogic(stroke);
      });
    });
  };

  const handleUndo = () => {
    const lastDrawing = myDrawings[myDrawings.length - 1];
    const updatedDrawings = myDrawings.slice(0, -1);

    setRedoStack((prev) => [...prev, lastDrawing]);
    setMyDrawings(updatedDrawings);

    if (!socket || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fbfff1";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    console.log("cleaning Canvas");

    updatedDrawings.forEach((strokes) =>
      strokes.forEach((stroke) => drawLogic(stroke))
    );

    socket.emit("undo", { id: lastDrawing[0].id, userId: user!.id });
  };

  const handleRedo = () => {
    console.log(redoStack);
    const undoDrawing = redoStack[redoStack.length - 1];

    setRedoStack((prev) => prev.slice(0, -1));
    setMyDrawings((prev) => [...prev, undoDrawing]);

    undoDrawing.map((stroke) => {
      emitStroke(stroke);
      drawLogic(stroke);
    });
  };

  const emitStroke = (stroke: Stroke) => {
    if (!socket) return;

    const strokeData: Stroke = {
      ...stroke,
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

      emitStroke({
        x,
        y,
        type: "begin",
        strokeColor,
        strokeSize,
        userId: user!.id,
      });
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

      emitStroke({
        x,
        y,
        type: "draw",
        strokeColor,
        strokeSize,
        userId: user!.id,
      });
    }
  };

  const handleTouchEnd = () => {
    if (!socket || !isDrawing) return;

    setIsDrawing(false);

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.closePath();
        emitStroke({
          x: 0,
          y: 0,
          type: "end",
          strokeColor,
          strokeSize,
          userId: user!.id,
        });
        debouncedSaveDrawing();
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

      emitStroke({
        x: clientX,
        y: clientY,
        type: "begin",
        strokeColor,
        strokeSize,
        userId: user!.id,
      });
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

      emitStroke({
        x: clientX,
        y: clientY,
        type: "draw",
        strokeColor,
        strokeSize,
        userId: user!.id,
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        emitStroke({
          x: 0,
          y: 0,
          type: "end",
          strokeColor,
          strokeSize,
          userId: user!.id,
        });
        debouncedSaveDrawing();
      }
    }

    if (strokes.length > 0) {
      setMyDrawings((prev) => [...prev, strokes]);
      setStrokes([]);
      debouncedSaveDrawing();
    }
  };

  const clearCanvas = () => {
    if (!socket || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fbfff1";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    setMyDrawings([]);
    setUserDrawings(null);
    setStrokes([]);
    setRedoStack([]);

    socket.emit("clearCanvas");
  };

  const downloadCanvas = async () => {
    const url = await drawingService.download();
    const link = document.createElement("a");
    link.href = url;
    link.download = `canvas.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        downloadCanvas,
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
};
