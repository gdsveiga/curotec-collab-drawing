import express from "express";
import { authService } from "src/services/user";
import { handleError } from "src/utils/errorHandler";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      throw new Error("Username and password are required");

    const user = await authService.register(username, password);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      throw new Error("Username and password are required");

    const { token, user } = await authService.login(username, password);
    res.json({ message: "Login successful", token, user });
  } catch (err) {
    next(err);
  }
});

export default router;
