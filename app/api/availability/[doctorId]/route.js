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
    const doctorId = params.doctorId;
    if (!doctorId) {
      return NextResponse.json(
        { error: "DoctorId is required" },
        { status: 400 }
      );
    }
    const parsedDoctorId = Number.parseInt(doctorId);
    if (isNaN(parsedDoctorId)) {
      return NextResponse.json({ error: "Invalid doctorId" }, { status: 400 });
    }
    const doctor = await db
      .collection("availability")
      .findOne({ doctorId: parsedDoctorId });
    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor availability not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching doctor availability" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const db = await connectToDatabase();
    const doctorId = Number.parseInt(params.doctorId);
    if (isNaN(doctorId)) {
      return NextResponse.json({ error: "Invalid doctorId" }, { status: 400 });
    }
    const updateData = await req.json();
    const result = await db
      .collection("availability")
      .updateOne({ doctorId }, { $set: updateData });
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Doctor availability not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Doctor availability updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating doctor availability:", error);
    return NextResponse.json(
      { error: "An error occurred while updating a doctor availability" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = await connectToDatabase();
    const doctorId = Number.parseInt(params.doctorId);
    if (isNaN(doctorId)) {
      return NextResponse.json({ error: "Invalid doctorId" }, { status: 400 });
    }
    const result = await db.collection("availability").deleteOne({ doctorId });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Doctor availability not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Doctor availability deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting a doctor availability" },
      { status: 500 }
    );
  }
}

process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
