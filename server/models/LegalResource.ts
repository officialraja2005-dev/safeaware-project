import mongoose, { Schema, Document } from "mongoose";

export interface ILegalResource extends Document {
  id: string;
  title: string;
  topic: string;
  summary: string;
  generalInformation: string;
  officialSourceUrl?: string | null;
  jurisdiction: string;
  lastVerified: Date;
  published: boolean;
}

const LegalResourceSchema = new Schema<ILegalResource>(
  {
    title: { type: String, required: true },
    topic: { type: String, required: true },
    summary: { type: String, required: true },
    generalInformation: { type: String, required: true },
    officialSourceUrl: { type: String, default: null },
    jurisdiction: { type: String, default: "India (National)" },
    lastVerified: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

LegalResourceSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    ret.general_information = ret.generalInformation;
    ret.official_source_url = ret.officialSourceUrl;
    ret.last_verified = ret.lastVerified ? ret.lastVerified.toISOString().split("T")[0] : "";
    delete ret.__v;
    return ret;
  },
});

export const LegalResource = mongoose.model<ILegalResource>("LegalResource", LegalResourceSchema);

