import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import Appointment from "@/models/appointment";

let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
  return client.db("hms");
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const appointments = await db
      .collection("appointment")
      .find({})
      .limit(20)
      .toArray();
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching appointments" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const appointmentData = await req.json();

    const appointmentId = appointmentData.appointmentId;
    console.log(appointmentData.appointmentId);
    if (!appointmentId) {
      return NextResponse.json(
        { error: "AppointmentId is required" },
        { status: 400 }
      );
    }
    const parsedAppointmentId = Number.parseInt(appointmentId);
    const appointment = await db
      .collection("appointment")
      .findOne({ appointmentId: parsedAppointmentId });
    if (appointment)
      return NextResponse.json(
        { error: "Appointment already exists" },
        { status: 400 }
      );

    const newAppointment = new Appointment(appointmentData);
    const validationError = newAppointment.validateSync();
    if (validationError) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }

    const result = await db.collection("appointment").insertOne(newAppointment);
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("Error adding appointment:", error);
    return NextResponse.json(
      { error: "An error occurred while adding a appointment" },
      { status: 500 }
    );
  }
}

process.on("SIGINT", async () => {
  if (client) {
    await client.close();
  }
  process.exit(0);
});
