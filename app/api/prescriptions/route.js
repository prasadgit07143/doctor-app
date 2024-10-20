import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import Prescription from "@/models/prescription";

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
    const prescriptions = await db
      .collection("prescription")
      .find({})
      .limit(20)
      .toArray();
    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching prescriptions" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const prescriptionData = await req.json();
    const prescriptionId = prescriptionData.prescriptionId;
    console.log(prescriptionData.prescriptionId);
    if (!prescriptionId) {
      return NextResponse.json(
        { error: "prescriptionId is required" },
        { status: 400 }
      );
    }
    const parsedPrescriptionId = Number.parseInt(prescriptionId);
    const prescription = await db
      .collection("prescription")
      .findOne({ prescriptionId: parsedPrescriptionId });
    if (prescription)
      return NextResponse.json(
        { error: "Prescription already exists" },
        { status: 400 }
      );
    const newPrescription = new Prescription(prescriptionData);
    const validationError = newPrescription.validateSync();
    if (validationError) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }

    const result = await db
      .collection("prescription")
      .insertOne(newPrescription);
    return NextResponse.json(newPrescription, { status: 201 });
  } catch (error) {
    console.error("Error adding prescription:", error);
    return NextResponse.json(
      { error: "An error occurred while adding a prescription" },
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
