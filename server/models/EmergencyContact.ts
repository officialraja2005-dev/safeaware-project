import mongoose, { Schema, Document } from "mongoose";

export interface IEmergencyContact extends Document {
  id: string;
  name: string;
  description: string;
  phone: string;
  website?: string | null;
  category: string;
  jurisdiction: string;
  isActive: boolean;
}

const EmergencyContactSchema = new Schema<IEmergencyContact>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String, default: null },
    category: { type: String, required: true },
    jurisdiction: { type: String, default: "India (National)" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

EmergencyContactSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    ret.is_active = ret.isActive;
    delete ret.__v;
    return ret;
  },
});

export const EmergencyContact = mongoose.model<IEmergencyContact>("EmergencyContact", EmergencyContactSchema);

