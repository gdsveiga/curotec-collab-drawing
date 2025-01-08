import { authenticate } from "src/middleware/auth";
import { drawingService } from "src/services/drawing";
import { handleError } from "src/utils/errorHandler";
import express from "express";

const router = express.Router();

router.post("/", authenticate, async (req, res, next) => {
  try {
    const savedDrawing = await drawingService.createDrawing(req.body);
    res.status(201).json(savedDrawing);
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
