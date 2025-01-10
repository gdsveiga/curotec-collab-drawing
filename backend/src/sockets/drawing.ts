import mongoose from "mongoose";
import { Server } from "socket.io";
import Drawing from "src/models/drawing";
import User from "src/models/user";
import { authService } from "src/services/user";

const drawingSocket = (io: Server) => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId as string;

    if (!userId) {
      socket.disconnect();
      return;
    }

    User.findOneAndUpdate(
      { _id: userId },
      { status: "online" },
      { upsert: true }
    )
      .then((res) => {
        console.log(res);
        io.emit("userStatusChanged", {
          userId,
          username: res?.username,
          status: "online",
        });
      })
      .catch((err) => console.error(err));

    socket.on("draw", (data) => {
      socket.broadcast.emit("draw", data);
    });

    socket.on("saveDrawing", async (data) => {
      try {
        const drawing = new Drawing({
          strokes: data.strokes,
          userId: data.userId,
        });
        await drawing.save();
        socket.broadcast.emit("saveDrawing", {
          userId: data.userId,
          id: drawing._id,
          createdAt: drawing.createdAt,
          strokes: drawing.strokes,
        });
      } catch (err) {
        console.error("Error saving drawing:", err);
      }
    });

    socket.on("clearCanvas", async () => {
      try {
        const response = await Drawing.deleteMany();
        socket.broadcast.emit("clearCanvas");
      } catch (err) {
        console.error("Error clearing canvas:", err);
      }
    });

    socket.on("undo", async (data) => {
      try {
        const response = await Drawing.deleteOne({ id: data.id });
        socket.broadcast.emit("undo", {
          drawingId: data.id,
          userId: data.userId,
        });
      } catch (err) {
        console.error("Error removing last drawing:", err);
      }
    });

    socket.on("disconnect", () => {
      User.findOneAndUpdate({ _id: userId }, { status: "offline" })
        .then((res) => {
          io.emit("userStatusChanged", {
            userId,
            username: res?.username,
            status: "offline",
          });
        })
        .catch((err) => console.error(err));
    });
  });
};

export default drawingSocket;
