import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import Availability from "@/models/availability";

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
    const availability = await db
      .collection("availability")
      .find({})
      .limit(20)
      .toArray();
    return NextResponse.json(availability);
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching availability" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const availabilityData = await req.json();
    const doctorId = availabilityData.doctorId;
    console.log(availabilityData.doctorId);
    if (!doctorId) {
      return NextResponse.json(
        { error: "DoctorId is required" },
        { status: 400 }
      );
    }
    const parsedDoctorId = Number.parseInt(doctorId);
    const availability = await db
      .collection("availability")
      .findOne({ doctorId: parsedDoctorId });
    if (availability)
      return NextResponse.json(
        { error: "Availability already added" },
        { status: 400 }
      );
    const newAvailability = new Availability(availabilityData);
    const validationError = newAvailability.validateSync();
    if (validationError) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }

    const result = await db
      .collection("availability")
      .insertOne(newAvailability);
    return NextResponse.json(newAvailability, { status: 201 });
  } catch (error) {
    console.error("Error adding availability:", error);
    return NextResponse.json(
      { error: "An error occurred while adding a availability" },
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
