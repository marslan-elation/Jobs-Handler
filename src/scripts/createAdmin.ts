// scripts/createAdmin.ts
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";

import User from "../models/User";

async function createAdmin() {
    await mongoose.connect(process.env.MONGODB_URI!);
    const username = process.env.ADMIN_USERNAME;
    const userpwd = process.env.ADMIN_PASSWORD;

    if (!username || !userpwd) {
        throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env");
    }

    const hashedPassword = await bcrypt.hash(userpwd, 10);

    const existing = await User.findOne({ email: username });
    if (!existing) {
        await User.create({
            email: username,
            password: hashedPassword,
        });
        console.log("Admin user created");
    } else {
        console.log("Admin already exists");
    }

    await mongoose.disconnect();
}

createAdmin();