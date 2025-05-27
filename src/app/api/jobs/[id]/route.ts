import { NextResponse } from "next/server";
import JobApplication from "@/models/JobApplication";
import { connectToDatabase } from "@/lib/mongodb";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    await JobApplication.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted" });
}