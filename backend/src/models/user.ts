import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
  username: string;
  password: string;
  isValidPassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
