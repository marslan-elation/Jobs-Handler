import { NextResponse } from "next/server";
import JobApplication from "@/models/JobApplication";
import { connectToDatabase } from "@/lib/mongodb";

export async function PATCH(req: Request, context: { params: { id: string } }) {
    await connectToDatabase();
    const jobId = context.params.id;

    const job = await JobApplication.findById(jobId);
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

    job.isActive = !job.isActive;
    await job.save();
    return NextResponse.json(job);
}
