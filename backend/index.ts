import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "src/config/db";
import loginRoutes from "src/routes/login";
import drawingRoutes from "src/routes/drawings";
import { handleError } from "src/middleware/error";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", loginRoutes);
app.use("/api/drawing", drawingRoutes);

app.use(handleError);

connectDB();

server.listen(4000, () => console.log("Server listening on port 4000"));
