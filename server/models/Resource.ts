import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  sourceUrl?: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    sourceUrl: { type: String, default: null },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ResourceSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    ret.source_url = ret.sourceUrl;
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;
    delete ret.__v;
    return ret;
  },
});

export const Resource = mongoose.model<IResource>("Resource", ResourceSchema);

