import { NextResponse } from "next/server";
import JobApplication from "@/models/JobApplication";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
    await connectToDatabase();
    const jobs = await JobApplication.find().sort({ createdAt: -1 });
    return NextResponse.json(jobs);
}

export async function POST(req: Request) {
    await connectToDatabase();
    const data = await req.json();
    const job = await JobApplication.create(data);
    return NextResponse.json(job);
}