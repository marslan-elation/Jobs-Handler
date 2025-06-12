import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema(
    {
        company: { type: String }, // optional
        platform: { type: String, required: true },
        jobType: { type: String, required: true },
        locationType: { type: String, require: true },
        jobLink: { type: String, required: true },
        jobTitle: { type: String, required: true },
        sharedExperience: { type: String, required: true },
        actualExperience: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        salaryOffered: { type: Number, required: true },
        salaryExpected: { type: Number, required: true },
        currency: { type: String, required: true },
        status: { type: String, required: true },
        resumeLink: { type: String, required: true },
        appliedDate: { type: Date, required: true },
        coverLetter: { type: String }, // optional
        isSalartPerAnnum: { type: Boolean, default: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.JobApplication ||
    mongoose.model("JobApplication", JobApplicationSchema);
