// models/Permission.ts
import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    module: { type: String, enum: ['outreach', 'jobs'] },
    accessLevel: { type: String, enum: ['read', 'write', 'admin'], default: 'read' }
}, { timestamps: true });

export default mongoose.models.Permission || mongoose.model("Permission", permissionSchema);
