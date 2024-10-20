import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db("hms");
}

export async function GET(req, { params }) {
  try {
    const db = await connectToDatabase();
    const prescriptionId = params.prescriptionId;
    if (!prescriptionId) {
      return NextResponse.json(
        { error: "PrescriptionId is required" },
        { status: 400 }
      );
    }
    const parsedPrescriptionId = Number.parseInt(prescriptionId);
    if (isNaN(parsedPrescriptionId)) {
      return NextResponse.json(
        { error: "Invalid prescriptionId" },
        { status: 400 }
      );
    }
    const prescription = await db
      .collection("prescription")
      .findOne({ prescriptionId: parsedPrescriptionId });
    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(prescription);
  } catch (error) {
    console.error("Error fetching prescription:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching prescription" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const db = await connectToDatabase();
    const prescriptionId = Number.parseInt(params.prescriptionId);
    if (isNaN(prescriptionId)) {
      return NextResponse.json(
        { error: "Invalid prescriptionId" },
        { status: 400 }
      );
    }
    const updateData = await req.json();
    const result = await db
      .collection("prescription")
      .updateOne({ prescriptionId }, { $set: updateData });
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Prescription updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating prescription:", error);
    return NextResponse.json(
      { error: "An error occurred while updating a prescription" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = await connectToDatabase();
    const prescriptionId = Number.parseInt(params.prescriptionId);
    if (isNaN(prescriptionId)) {
      return NextResponse.json(
        { error: "Invalid prescriptionId" },
        { status: 400 }
      );
    }
    const result = await db
      .collection("prescription")
      .deleteOne({ prescriptionId });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Prescription deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting prescription:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting a prescription" },
      { status: 500 }
    );
  }
}

process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
