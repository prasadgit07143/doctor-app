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
    const email = params.email;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const doctor = await db.collection("doctor").findOne({ email: email });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching doctor" },
      { status: 500 }
    );
  }
}
