import { Schema, model, models } from "mongoose";

const LabtestSchema = new Schema(
  {
    labtestId: {
      type: Number,
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
    name: {
      type: String,
      required: true,
    },
    testType: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    result: {
      type: String,
      default: "Not Available",
    },
    date: {
      type: Date,
      default:
        new Date().getFullYear() +
        "-" +
        new Date().getMonth() +
        "-" +
        new Date().getDate(),
    },
  },
  { timestamps: true }
);

LabtestSchema.index({ labtestId: 1, doctorId: 1, patientId: 1, testType: 1 });

const Labtest = models.Labtest || model("Labtest", LabtestSchema);

export default Labtest;
