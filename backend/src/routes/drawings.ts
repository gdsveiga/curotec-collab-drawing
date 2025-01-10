import { authenticate } from "src/middleware/auth";
import { drawingService } from "src/services/drawing";
import express from "express";
import { createCanvas, draw } from "src/utils/canvas";
import { createWriteStream } from "fs";

const router = express.Router();

router.post("/", authenticate, async (req, res, next) => {
  try {
    const savedDrawing = await drawingService.createDrawing(req.body);
    res.status(201).json(savedDrawing);
  } catch (err) {
    next(err);
  }
});

router.get("/download", authenticate, async (req, res, next) => {
  try {
    const drawings = await drawingService.getAllDrawings();

    const { canvas, ctx } = createCanvas();

    ctx.fillStyle = "#fbfff1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawings.forEach((drawing) => {
      drawing.strokes.forEach((stroke) => {
        draw(canvas, ctx, stroke);
      });
    });

    const url = canvas.toDataURL();
    res.send(url);
  } catch (err) {
    next(err);
  }
});

router.get("/", authenticate, async (req, res, next) => {
  try {
    const drawings = await drawingService.getAllDrawings();
    res.status(200).json(drawings);
  } catch (err) {
    next(err);
  }
});

export default router;
