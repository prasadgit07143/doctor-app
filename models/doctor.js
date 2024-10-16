import { Schema, model, models } from "mongoose";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const nameRegex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const DoctorSchema = new Schema(
  {
    doctorId: {
      type: Number,
      unique: true,
      required: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, "Email is invalid!"],
      index: true,
    },
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minLength: [8, "Name must be at least 8 characters long!"],
      maxLength: [30, "Name must be at most 30 characters long!"],
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minLength: [8, "Password must be at least 8 characters long!"],
      maxLength: [30, "Password must be at most 30 characters long!"],
      match: [
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character!",
      ],
    },
    age: {
      type: Number,
      required: true,
      min: [18, "Age must be at least 18 years old!"],
      max: [120, "Age must be at most 120 years old!"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    contact: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
    },
    qualification: {
      type: String,
      trim: true,
      required: true,
    },
    specialization: {
      type: String,
      trim: true,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: [0, "Experience cannot be negative!"],
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
  { timestamps: true }
);

DoctorSchema.index({ email: 1, doctorId: 1 });

const Doctor = models.Doctor || model("Doctor", DoctorSchema);

export default Doctor;
