
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import JobAppSetting from "@/models/JobAppSetting";

// GET: Fetch settings
export async function GET() {
    await connectToDatabase();

    const setting = await JobAppSetting.findOne();
    return NextResponse.json(setting || {});
}

// POST: Create if not exists, else update
export async function POST(req: Request) {
    await connectToDatabase();
    const body = await req.json();

    const { localCurrency, convertCurrency } = body;

    if (!localCurrency && convertCurrency) {
        return NextResponse.json({ message: "localCurrency is required" }, { status: 400 });
    }

    let setting = await JobAppSetting.findOne();

    if (!setting) {
        // Create new setting
        setting = await JobAppSetting.create({
            localCurrency,
            convertCurrency: convertCurrency ?? false
        });
    } else {
        // Update existing
        setting.localCurrency = localCurrency;
        setting.convertCurrency = convertCurrency ?? setting.convertCurrency;
        await setting.save();
    }

    return NextResponse.json(setting);
}
