import { DrawingProvider } from "src/contexts/drawing";
import Canvas from "./canvas";
import Toolbar from "./toolbar";

function DrawingBoard() {
  return (
    <DrawingProvider>
      <Canvas />
      <Toolbar />
    </DrawingProvider>
  );
}

export default DrawingBoard;
