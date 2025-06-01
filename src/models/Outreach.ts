import mongoose, { Schema, Document, Model } from 'mongoose';

interface ILog {
    message: string;
    timestamp: Date;
    type: 'Sent' | 'Response' | 'Follow-Up';
}

interface IOutreach extends Document {
    subject?: string;
    messageBody?: string;
    contactEmail: string;
    company: string;
    jobRole?: string;
    tags?: string[];
    status: 'Sent' | 'Followed Up' | 'Responded' | 'Accepted' | 'Rejected' | 'No Reply';
    followUpDate?: Date;
    responseDate?: Date;
    isActive: boolean;
    logs?: ILog[];
    user?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const logSchema = new Schema<ILog>({
    message: { type: String },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['Sent', 'Response', 'Follow-Up'], default: 'Sent' },
});

const outreachSchema = new Schema<IOutreach>(
    {
        subject: String,
        messageBody: String,
        contactEmail: { type: String, required: true },
        company: { type: String, required: true },
        jobRole: String,
        tags: [String],
        status: {
            type: String,
            enum: ['Sent', 'Followed Up', 'Responded', 'Accepted', 'Rejected', 'No Reply'],
            default: 'Sent',
        },
        followUpDate: Date,
        responseDate: Date,
        isActive: { type: Boolean, default: true },
        logs: [logSchema],
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

const OutreachModel: Model<IOutreach> = mongoose.models.Outreach || mongoose.model<IOutreach>('Outreach', outreachSchema);
export default OutreachModel;