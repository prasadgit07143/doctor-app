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
    const specialization = params.specialization;

    const doctors = await db
      .collection("doctor")
      .find({ specialization: specialization })
      .toArray();

    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching doctors" },
      { status: 500 }
    );
  }
}
