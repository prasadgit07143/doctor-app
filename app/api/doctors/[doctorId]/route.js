import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

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
      .collection("doctor")
      .findOne({ doctorId: parsedDoctorId });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching doctor" },
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
      .collection("doctor")
      .updateOne({ doctorId }, { $set: updateData });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Doctor updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating doctor:", error);
    return NextResponse.json(
      { error: "An error occurred while updating a doctor" },
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
    const result = await db.collection("doctor").deleteOne({ doctorId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Doctor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting a doctor" },
      { status: 500 }
    );
  }
}

process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
