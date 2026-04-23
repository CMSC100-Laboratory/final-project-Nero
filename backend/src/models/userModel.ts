import { Document, Schema, model, Types } from "mongoose";

export interface IUserSafe extends Document {
  _id: Types.ObjectId;
  firstname: string;
  middlename?: string;
  lastname: string;
  email: string;
  userType: "admin" | "user";
}

interface IUserFull extends IUserSafe {
  password: string;
}

const userSchema = new Schema<IUserFull>(
  {
    firstname: { type: String, required: true },
    middlename: { type: String },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    userType: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

const User = model<IUserFull>("User", userSchema);

export default User;
