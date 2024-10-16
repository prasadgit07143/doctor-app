import { Schema, model, models } from "mongoose";

const AppointmentSchema = new Schema(
  {
    appointmentId: {
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
    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },
    appointmentTime: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
        },
        message: (props) => `${props.value} is not a valid time format!`,
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
      index: true,
    },
  },
  { timestamps: true }
);

AppointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, appointmentTime: 1 },
  { unique: true }
);

const Appointment =
  models.Appointment || model("Appointment", AppointmentSchema);

export default Appointment;
