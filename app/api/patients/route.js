import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import Patient from "@/models/patient";

let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db("hms");
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const patients = await db
      .collection("patient")
      .find({})
      .limit(20)
      .toArray();
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching patients" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const patientData = await req.json();

    const patientId = patientData.patientId;
    console.log(patientData.patientId);
    if (!patientId) {
      return NextResponse.json(
        { error: "PatientId is required" },
        { status: 400 }
      );
    }
    const parsedPatientId = Number.parseInt(patientId);
    const patient = await db
      .collection("patient")
      .findOne({ patientId: parsedPatientId });
    if (patient)
      return NextResponse.json(
        { error: "Patient already exists" },
        { status: 400 }
      );

    const newPatient = new Patient(patientData);
    const validationError = newPatient.validateSync();
    if (validationError) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }

    const result = await db.collection("patient").insertOne(newPatient);
    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error("Error adding patient:", error);
    return NextResponse.json(
      { error: "An error occurred while adding a patient" },
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
