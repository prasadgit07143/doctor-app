import { Schema, model, models } from "mongoose";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

const AdminSchema = new Schema(
  {
    adminId: {
      type: Number,
      unique: true,
      required: [true, "Admin ID is required"],
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [emailRegex, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      match: [passwordRegex, "Password must meet complexity requirements"],
    },
  },
  {
    timestamps: true,
  }
);

AdminSchema.index({ email: 1 });

const Admin = models.Admin || model("Admin", AdminSchema);
export default Admin;
