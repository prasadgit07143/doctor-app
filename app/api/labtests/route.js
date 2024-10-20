import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import Labtest from "@/models/labtest";

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
    const labtests = await db
      .collection("labtest")
      .find({})
      .limit(20)
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

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const labtestData = await req.json();
    const labtestId = labtestData.labtestId;
    console.log(labtestData.labtestId);
    if (!labtestId) {
      return NextResponse.json(
        { error: "LabtestId is required" },
        { status: 400 }
      );
    }
    const parsedLabtestId = Number.parseInt(labtestId);
    const labtest = await db
      .collection("labtest")
      .findOne({ labtestId: parsedLabtestId });
    if (labtest)
      return NextResponse.json(
        { error: "Labtest already exists" },
        { status: 400 }
      );
    const newLabtest = new Labtest(labtestData);
    const validationError = newLabtest.validateSync();
    if (validationError) {
      return NextResponse.json(
        { error: validationError.message },
        { status: 400 }
      );
    }

    const result = await db.collection("labtest").insertOne(newLabtest);
    return NextResponse.json(newLabtest, { status: 201 });
  } catch (error) {
    console.error("Error adding labtest:", error);
    return NextResponse.json(
      { error: "An error occurred while adding a labtest" },
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
