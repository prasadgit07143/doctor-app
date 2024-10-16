import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    notificationId: {
      type: Number,
      unique: true,
      required: true,
      index: true,
    },
    userId: {
      type: Number,
      required: true,
      index: true,
    },
    notificationType: {
      type: String,
      enum: ["Appointment", "Feedback", "Test Result"],
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Notification message must not exceed 500 characters!"],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      enum: ["Unread", "Read"],
      default: "Unread",
      index: true,
    },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, date: -1 });

const Notification =
  models.Notification || model("Notification", NotificationSchema);

export default Notification;
