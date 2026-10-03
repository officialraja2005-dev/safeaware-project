import mongoose, { Schema, Document } from "mongoose";

export interface ICampaign extends Document {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  coverImage?: string | null;
  topics: string[];
  startDate: Date;
  endDate: Date;
  status: "draft" | "published" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String, default: null },
    topics: { type: [String], default: [] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["draft", "published", "completed"], default: "published" },
  },
  { timestamps: true }
);

CampaignSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    ret.start_date = ret.startDate ? ret.startDate.toISOString().split("T")[0] : "";
    ret.end_date = ret.endDate ? ret.endDate.toISOString().split("T")[0] : "";
    ret.cover_image = ret.coverImage;
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;
    delete ret.__v;
    return ret;
  },
});

export const Campaign = mongoose.model<ICampaign>("Campaign", CampaignSchema);

