import mongoose from "mongoose";
import { Server } from "socket.io";
import Drawing from "src/models/drawing";

const drawingSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("draw", (data) => {
      socket.broadcast.emit("draw", data);
    });

    socket.on("saveDrawing", async (data) => {
      try {
        const drawing = new Drawing({
          strokes: data.strokes,
          userId: data.userId,
        });
        console.log("Saving drawing:", data);
        await drawing.save();
        socket.broadcast.emit("saveDrawing", {
          userId: data.userId,
          id: drawing._id,
          createdAt: drawing.createdAt,
          strokes: drawing.strokes,
        });
        console.log("Drawing saved successfully!");
      } catch (err) {
        console.error("Error saving drawing:", err);
      }
    });

    socket.on("clearCanvas", async () => {
      try {
        const response = await Drawing.deleteMany();
        console.log(response);
        socket.broadcast.emit("clearCanvas");
      } catch (err) {
        console.error("Error clearing canvas:", err);
      }
    });

    socket.on("undo", async (data) => {
      try {
        const response = await Drawing.deleteOne({ id: data.id });
        console.log(response);
        socket.broadcast.emit("undo", {
          drawingId: data.id,
          userId: data.userId,
        });
      } catch (err) {
        console.error("Error removing last drawing:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default drawingSocket;
