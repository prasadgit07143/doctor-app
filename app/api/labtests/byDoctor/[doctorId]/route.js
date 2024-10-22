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
    const doctorId = parseInt(params.doctorId);

    const labtests = await db
      .collection("labtest")
      .find({ doctorId: doctorId })
      .toArray();

    return NextResponse.json(labtests);
  } catch (error) {
    console.error("Error fetching labtests:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching labtests" },
      { status: 500 }
    );
  }
}
