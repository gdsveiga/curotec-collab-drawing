import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "src/config/db";
import loginRoutes from "src/routes/login";
import drawingRoutes from "src/routes/drawings";
import { handleError } from "src/middleware/error";
import drawingSocket from "src/sockets/drawing";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", loginRoutes);
app.use("/api/drawings", drawingRoutes);

app.use(handleError);

drawingSocket(io);

connectDB();

server.listen(4000, () => console.log("Server listening on port 4000"));
