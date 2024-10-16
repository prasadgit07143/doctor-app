import mongoose, { connect } from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("MongoDB connected !");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "sample_mflix",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected !");
  } catch (err) {
    console.log(err);
  }
};

connectToDB();
