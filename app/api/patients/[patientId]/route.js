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
    const patientId = params.patientId;
    if (!patientId) {
      return NextResponse.json(
        { error: "PatientId is required" },
        { status: 400 }
      );
    }
    const parsedPatientId = Number.parseInt(patientId);
    if (isNaN(parsedPatientId)) {
      return NextResponse.json({ error: "Invalid patientId" }, { status: 400 });
    }
    const patient = await db
      .collection("patient")
      .findOne({ patientId: parsedPatientId });
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching patient" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const db = await connectToDatabase();
    const patientId = Number.parseInt(params.patientId);
    if (isNaN(patientId)) {
      return NextResponse.json({ error: "Invalid patientId" }, { status: 400 });
    }
    const updateData = await req.json();
    const result = await db
      .collection("patient")
      .updateOne({ patientId }, { $set: updateData });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Patient updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: "An error occurred while updating a patient" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = await connectToDatabase();
    const patientId = Number.parseInt(params.patientId);
    if (isNaN(patientId)) {
      return NextResponse.json({ error: "Invalid patientId" }, { status: 400 });
    }
    const result = await db.collection("patient").deleteOne({ patientId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Patient deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting a patient" },
      { status: 500 }
    );
  }
}

process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
