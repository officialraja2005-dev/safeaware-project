import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  phoneOptional?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phoneOptional: { type: String, default: null },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    ret.full_name = ret.fullName;
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model<IUser>("User", UserSchema);

