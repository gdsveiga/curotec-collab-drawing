import simplify from "simplify-js";
import { Stroke } from "src/@types/drawing";

export function simplifyStrokes(strokes: Stroke[]) {
  const simplifiedPoints = simplify(
    strokes.map((s) => ({ x: s.x, y: s.y })),
    0.75
  );

  const simplifiedStrokes = simplifiedPoints.map((point, index): Stroke => {
    const originalStroke = strokes.find(
      (s) => s.x === point.x && s.y === point.y
    );

    return {
      x: point.x,
      y: point.y,
      type: index === 0 ? "begin" : "draw",
      strokeSize: originalStroke?.strokeSize || 2,
      strokeColor: originalStroke?.strokeColor || "#000000",
      userId: originalStroke?.userId || "",
    };
  });

  if (simplifiedStrokes.length > 0) {
    simplifiedStrokes[simplifiedStrokes.length - 1].type = "end";
  }

  return simplifiedStrokes;
}
