import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

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

export async function GET(req, { params }) {
  try {
    const db = await connectToDatabase();
    const appointmentId = params.appointmentId;
    if (!appointmentId) {
      return NextResponse.json(
        { error: "AppointmentId is required" },
        { status: 400 }
      );
    }
    const parsedAppointmentId = Number.parseInt(appointmentId);
    if (isNaN(parsedAppointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointmentId" },
        { status: 400 }
      );
    }
    const appointment = await db
      .collection("appointment")
      .findOne({ appointmentId: parsedAppointmentId });
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching appointment" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const db = await connectToDatabase();
    const appointmentId = Number.parseInt(params.appointmentId);
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointmentId" },
        { status: 400 }
      );
    }
    const updateData = await req.json();
    const result = await db
      .collection("appointment")
      .updateOne({ appointmentId }, { $set: updateData });
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Appointment updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "An error occurred while updating a appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = await connectToDatabase();
    const appointmentId = Number.parseInt(params.appointmentId);
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointmentId" },
        { status: 400 }
      );
    }
    const result = await db
      .collection("appointment")
      .deleteOne({ appointmentId });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting a appointment" },
      { status: 500 }
    );
  }
}

process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
