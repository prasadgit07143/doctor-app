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

export async function GET(request, { params }) {
  try {
    const db = await connectToDatabase();
    const patientId = parseInt(params.patientId);

    const prescriptions = await db
      .collection("prescription")
      .find({ patientId: patientId })
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
