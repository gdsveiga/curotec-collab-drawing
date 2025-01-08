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
        const drawing = new Drawing({ strokes: data.strokes });
        console.log("Saving drawing:", data);
        await drawing.save();
        console.log("Drawing saved successfully!");
      } catch (err) {
        console.error("Error saving drawing:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default drawingSocket;
