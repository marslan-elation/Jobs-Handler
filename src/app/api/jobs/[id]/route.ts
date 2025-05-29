import { NextResponse } from "next/server";
import JobApplication from "@/models/JobApplication";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: Request, context: { params: { id: string } }) {
    await connectToDatabase();
    const jobId = context.params.id;
    const response = await JobApplication.findById(jobId);
    return NextResponse.json(response);
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
    await connectToDatabase();
    const jobId = context.params.id;

    const body = await req.json();
    const job = await JobApplication.findById(jobId);
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.status !== undefined) job.status = body.status;

    await job.save();
    return NextResponse.json(job);
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
    await connectToDatabase();
    const jobId = context.params.id;
    await JobApplication.findByIdAndDelete(jobId);
    return NextResponse.json({ message: "Deleted" });
}
