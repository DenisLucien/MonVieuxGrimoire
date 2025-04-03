import  mongoose, {Document} from"mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
}

const User = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
export default mongoose.model<IUser>("User", User);
