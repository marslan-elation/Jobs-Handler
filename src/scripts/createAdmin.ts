import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config({path: '.env.local'});

async function createAdmin() {
    const dbUrl = process.env.MONGODB_URI;    
    if (!dbUrl) {
        throw new Error("MONGODB_URI must be set in .env");
    }

    await mongoose.connect(dbUrl);
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