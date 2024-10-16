import { Schema, model, models } from "mongoose";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
const contactRegex = /^\+?[1-9]\d{1,14}$/;

const PatientSchema = new Schema(
  {
    patientId: {
      type: Number,
      unique: true,
      required: [true, "Patient ID is required"],
      index: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age must be a positive number"],
      max: [120, "Age must be at most 120 years old"],
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female"],
        message: "{VALUE} is not a valid gender",
      },
      required: [true, "Gender is required"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email address is required"],
      unique: true,
      match: [emailRegex, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      match: [passwordRegex, "Password must meet complexity requirements"],
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      unique: true,
      match: [contactRegex, "Please enter a valid contact number"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minLength: [10, "Address must be at least 10 characters long"],
      maxLength: [100, "Address must be at most 100 characters long"],
    },
    image: {
      type: String,
      default: "/default-profile.jpg",
    },
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

PatientSchema.index({ email: 1, phone: 1 });

const Patient = models.Patient || model("Patient", PatientSchema);
export default Patient;
