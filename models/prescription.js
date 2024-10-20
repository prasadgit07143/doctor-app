import { Schema, model, models } from "mongoose";

const PrescriptionSchema = new Schema(
  {
    prescriptionId: {
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
    medicines: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          fullName: {
            type: String,
            required: true,
          },
          dosage: {
            type: Number,
            required: true,
          },
          frequency: {
            type: String,
            required: true,
          },
          duration: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
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

PrescriptionSchema.index({ prescriptionId: 1, doctorId: 1, patientId: 1 });

const Prescription =
  models.Prescription || model("Prescription", PrescriptionSchema);

export default Prescription;
