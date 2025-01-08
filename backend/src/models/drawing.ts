import mongoose, { Document, Schema, Model } from "mongoose";

interface IStroke {
  x: number;
  y: number;
  type: "begin" | "draw" | "end";
  strokeSize: number;
  strokeColor: string;
}

export interface IDrawing extends Document {
  strokes: IStroke[];
  createdAt: Date;
}

const strokeSchema = new Schema<IStroke>({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  type: { type: String, enum: ["begin", "draw", "end"], required: true },
  strokeSize: { type: Number, required: true },
  strokeColor: { type: String, required: true },
});

const drawingSchema = new Schema<IDrawing>({
  strokes: [strokeSchema],
  createdAt: { type: Date, default: Date.now },
});

const Drawing: Model<IDrawing> = mongoose.model<IDrawing>(
  "Drawing",
  drawingSchema
);

export default Drawing;
