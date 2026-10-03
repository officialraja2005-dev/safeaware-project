import mongoose, { Schema, Document } from "mongoose";

export interface ISafetyReport extends Document {
  id: string;
  userId?: mongoose.Types.ObjectId | null;
  category: string;
  description: string;
  approximateLocation?: string | null;
  incidentDate?: string | null;
  isAnonymous: boolean;
  contactInformation?: string | null;
  status: "new" | "reviewing" | "resolved" | "closed";
  adminNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const SafetyReportSchema = new Schema<ISafetyReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    category: { type: String, required: true },
    description: { type: String, required: true },
    approximateLocation: { type: String, default: null },
    incidentDate: { type: String, default: null },
    isAnonymous: { type: Boolean, default: true },
    contactInformation: { type: String, default: null },
    status: { type: String, enum: ["new", "reviewing", "resolved", "closed"], default: "new" },
    adminNotes: { type: String, default: null },
  },
  { timestamps: true }
);

SafetyReportSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    ret.user_id = ret.userId ? ret.userId.toString() : null;
    ret.approximate_location = ret.approximateLocation;
    ret.incident_date = ret.incidentDate;
    ret.is_anonymous = ret.isAnonymous;
    ret.contact_information = ret.contactInformation;
    ret.admin_notes = ret.adminNotes;
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;
    delete ret.__v;
    return ret;
  },
});

export const SafetyReport = mongoose.model<ISafetyReport>("SafetyReport", SafetyReportSchema);

