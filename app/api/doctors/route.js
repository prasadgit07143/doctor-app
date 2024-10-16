import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import Doctor from "@/models/doctor";

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
    const doctors = await db.collection("doctor").find({}).limit(20).toArray();
    return NextResponse.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching doctors" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const doctorData = await req.json();

    const newDoctor = new Doctor(doctorData);
    const validationError = newDoctor.validateSync();
    if (validationError) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }

    const result = await db.collection("doctor").insertOne(newDoctor);
    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error) {
    console.error("Error adding doctor:", error);
    return NextResponse.json(
      { error: "An error occurred while adding a doctor" },
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
