import mongoose, { Schema, Document } from "mongoose";

export interface ISurveyResponse extends Document {
  id: string;
  userId?: mongoose.Types.ObjectId | null;
  isAnonymous: boolean;
  answers: Record<string, string>;
  createdAt: Date;
}

const SurveyResponseSchema = new Schema<ISurveyResponse>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    isAnonymous: { type: Boolean, default: false },
    answers: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

SurveyResponseSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    ret.user_id = ret.userId ? ret.userId.toString() : null;
    ret.is_anonymous = ret.isAnonymous;
    ret.created_at = ret.createdAt;
    if (ret.answers instanceof Map) {
      ret.answers = Object.fromEntries(ret.answers);
    }
    delete ret.__v;
    return ret;
  },
});

export const SurveyResponse = mongoose.model<ISurveyResponse>("SurveyResponse", SurveyResponseSchema);

