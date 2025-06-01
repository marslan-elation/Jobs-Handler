import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Outreach from '@/models/Outreach';
import { Types } from 'mongoose';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await connectToDatabase();
  const outreach = await Outreach.findById(id);
  if (!outreach) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(outreach);
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await connectToDatabase();
  const body = await req.json();
  const outreach = await Outreach.findById(id);
  if (!outreach) return NextResponse.json({ error: "Not found" }, { status: 404 });

  Object.assign(outreach, body);
  await outreach.save();
  return NextResponse.json(outreach);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await connectToDatabase();
  const deleted = await Outreach.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Deleted successfully' });
}