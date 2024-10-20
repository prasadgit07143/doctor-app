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
    const labtestId = params.labtestId;
    if (!labtestId) {
      return NextResponse.json(
        { error: "LabtestId is required" },
        { status: 400 }
      );
    }
    const parsedLabtestId = Number.parseInt(labtestId);
    if (isNaN(parsedLabtestId)) {
      return NextResponse.json({ error: "Invalid labtestId" }, { status: 400 });
    }
    const labtest = await db
      .collection("labtest")
      .findOne({ labtestId: parsedLabtestId });
    if (!labtest) {
      return NextResponse.json({ error: "Labtest not found" }, { status: 404 });
    }
    return NextResponse.json(labtest);
  } catch (error) {
    console.error("Error fetching labtest:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching labtest" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const db = await connectToDatabase();
    const labtestId = Number.parseInt(params.labtestId);
    if (isNaN(labtestId)) {
      return NextResponse.json({ error: "Invalid labtestId" }, { status: 400 });
    }
    const updateData = await req.json();
    const result = await db
      .collection("labtest")
      .updateOne({ labtestId }, { $set: updateData });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Labtest not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Labtest updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating labtest:", error);
    return NextResponse.json(
      { error: "An error occurred while updating a labtest" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = await connectToDatabase();
    const labtestId = Number.parseInt(params.labtestId);
    if (isNaN(labtestId)) {
      return NextResponse.json({ error: "Invalid labtestId" }, { status: 400 });
    }
    const result = await db.collection("labtest").deleteOne({ labtestId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Labtest not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Labtest deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting labtest:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting a labtest" },
      { status: 500 }
    );
  }
}

process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
