import mongoose from "mongoose";
import { JobApplicationSetting } from "@/app/types/jobAppSettings";
const JobAppSetting = new mongoose.Schema(
    {
        localCurrency: {
            type: String,
            required: function (this: JobApplicationSetting) {
                return this.convertCurrency;
            },
        },
        convertCurrency: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export default mongoose.models.JobAppSetting || mongoose.model("JobAppSetting", JobAppSetting);