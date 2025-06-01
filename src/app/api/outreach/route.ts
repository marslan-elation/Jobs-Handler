import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Outreach from '@/models/Outreach';

export async function GET() {
    await connectToDatabase();
    const outreachList = await Outreach.find().sort({ createdAt: -1 });
    return NextResponse.json(outreachList);
}

export async function POST(req: Request) {
    await connectToDatabase();
    const body = await req.json();
    const outreach = await Outreach.create(body);
    return NextResponse.json(outreach, { status: 201 });
}