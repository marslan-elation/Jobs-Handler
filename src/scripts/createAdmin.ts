import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config({ path: '.env.local' });

async function createAdmin() {
    const dbUrl = process.env.MONGODB_URI;
    if (!dbUrl) {
        throw new Error("MONGODB_URI must be set in .env");
    }

    await mongoose.connect(dbUrl);

    const email = process.env.ADMIN_EMAIL;
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !email || !password) {
        throw new Error("ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD must all be set in .env.local");
    }

    const existing = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!existing) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            email,
            username,
            password: hashedPassword,
        });
        console.log("✅ Admin user created");
    } else {
        console.log("⚠️ Admin already exists");
    }

    await mongoose.disconnect();
}

createAdmin().catch((err) => {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
});
