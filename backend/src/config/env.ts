export const config = {
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  jwtExpiry: process.env.JWT_EXPIRY || "1h",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017",
};
