import { NextResponse } from "next/server";
import JobApplication from "@/models/JobApplication";
import { connectToDatabase } from "@/lib/mongodb";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    await JobApplication.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted" });
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    const response = await JobApplication.findById(params.id);
    return NextResponse.json(response);
}