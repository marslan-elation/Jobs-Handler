import { NextResponse } from "next/server";
import Outreach from "@/models/Outreach";
import { connectToDatabase } from "@/lib/mongodb";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    const { id } = await context.params;

    const outreach = await Outreach.findById(id);
    if (!outreach) return NextResponse.json({ error: "Not found" }, { status: 404 });

    outreach.isActive = !outreach.isActive;
    await outreach.save();
    return NextResponse.json(outreach);
}
