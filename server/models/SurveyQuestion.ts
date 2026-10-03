import mongoose, { Schema, Document } from "mongoose";

export interface ISurveyOption {
  id: string;
  label: string;
  orderIndex: number;
}

export interface ISurveyQuestion extends Document {
  id: string;
  prompt: string;
  questionType: "multiple_choice" | "checkbox" | "rating" | "yes_no" | "text";
  isRequired: boolean;
  isActive: boolean;
  orderIndex: number;
  options: ISurveyOption[];
}

const SurveyOptionSchema = new Schema<ISurveyOption>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    orderIndex: { type: Number, default: 0 },
  },
  { _id: false }
);

const SurveyQuestionSchema = new Schema<ISurveyQuestion>(
  {
    prompt: { type: String, required: true },
    questionType: {
      type: String,
      enum: ["multiple_choice", "checkbox", "rating", "yes_no", "text"],
      required: true,
    },
    isRequired: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    orderIndex: { type: Number, default: 0 },
    options: { type: [SurveyOptionSchema], default: [] },
  },
  { timestamps: true }
);

SurveyQuestionSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    ret.id = ret._id.toString();
    ret.question_type = ret.questionType;
    ret.is_required = ret.isRequired;
    ret.is_active = ret.isActive;
    ret.order_index = ret.orderIndex;
    if (ret.options) {
      ret.options = ret.options.map((opt: any) => ({
        id: opt.id,
        label: opt.label,
        order_index: opt.orderIndex,
      }));
    }
    delete ret.__v;
    return ret;
  },
});

export const SurveyQuestion = mongoose.model<ISurveyQuestion>("SurveyQuestion", SurveyQuestionSchema);

