import { Response } from "express";
import { IStroke } from "src/models/drawing";
import {
  Canvas,
  CanvasRenderingContext2D,
  createCanvas as createCanvasNode,
} from "canvas";

export const createCanvas = () => {
  const canvas = createCanvasNode(1920, 1080);
  const ctx = canvas.getContext("2d");

  return { canvas, ctx };
};

export const draw = (
  canvas: Canvas,
  ctx: CanvasRenderingContext2D,
  stroke: IStroke
) => {
  if (!canvas) return;

  ctx.strokeStyle = stroke.strokeColor;
  ctx.lineWidth = stroke.strokeSize;

  if (stroke.type === "begin") {
    ctx.beginPath();
    ctx.moveTo(stroke.x, stroke.y);
  } else if (stroke.type === "draw") {
    ctx.lineTo(stroke.x, stroke.y);
    ctx.stroke();
  } else if (stroke.type === "end") {
    ctx.closePath();
  }
};
