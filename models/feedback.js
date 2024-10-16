import { Schema, model, models } from "mongoose";

const FeedbackSchema = new Schema(
  {
    feedbackId: {
      type: Number,
      unique: true,
      required: true,
      index: true,
    },
    doctorId: {
      type: Number,
      required: true,
      index: true,
    },
    patientId: {
      type: Number,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1!"],
      max: [5, "Rating must be at most 5!"],
    },
    comment: {
      type: String,
      trim: true,
      required: true,
      maxlength: [500, "Comment must not exceed 500 characters!"],
    },
    dateSubmitted: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

FeedbackSchema.index({ doctorId: 1, patientId: 1, dateSubmitted: -1 });

const Feedback = models.Feedback || model("Feedback", FeedbackSchema);

export default Feedback;
