import { Schema, model, models } from "mongoose";

const AvailabilitySchema = new Schema(
  {
    doctorId: {
      type: Number,
      unique: true,
      required: true,
      index: true,
    },
    availableDays: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    availableSlots: {
      type: [String],
      default: [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
      ],
    },
    startTime: {
      type: String,
      default: "09:00",
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    endTime: {
      type: String,
      default: "20:00",
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    unAvailableDates: {
      type: [Date],
      default: [],
    },
  },
  { timestamps: true }
);

AvailabilitySchema.index({ doctorId: 1 });

const Availability =
  models.Availability || model("Availability", AvailabilitySchema);

export default Availability;
