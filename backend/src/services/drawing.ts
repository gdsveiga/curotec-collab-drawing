import Drawing, { IDrawing } from "src/models/drawing";

export const drawingService = {
  async createDrawing(data: Partial<IDrawing>) {
    const drawing = new Drawing(data);
    return drawing.save();
  },

  async getAllDrawings() {
    return Drawing.find();
  },
};
