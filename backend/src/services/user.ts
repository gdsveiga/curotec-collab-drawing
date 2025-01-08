import jwt from "jsonwebtoken";
import { config } from "src/config/env";
import User from "src/models/user";

export const authService = {
  async register(username: string, password: string) {
    const existingUser = await User.findOne({ username });
    if (existingUser) throw new Error("Username already exists");

    const user = new User({ username, password });
    await user.save();
    return user;
  },

  async login(username: string, password: string) {
    const user = await User.findOne({ username });
    if (!user || !(await user.isValidPassword(password))) {
      throw new Error("Invalid username or password");
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiry,
    });
    return { token, user };
  },

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch {
      throw new Error("Invalid or expired token");
    }
  },
};
