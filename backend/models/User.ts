import mongoose, { Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
export interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
userSchema.plugin(uniqueValidator);
const User = mongoose.model<IUser>("User", userSchema);
export default User;
