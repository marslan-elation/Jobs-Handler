import { NextResponse } from "next/server";
import JobApplication from "@/models/JobApplication";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    await connectToDatabase();
    const response = await JobApplication.findById(id);
    return NextResponse.json(response);
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    await connectToDatabase();
    const body = await req.json();
    const job = await JobApplication.findById(id);
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (body.status !== undefined) job.status = body.status;

    await job.save();
    return NextResponse.json(job);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    await connectToDatabase();
    await JobApplication.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
}
