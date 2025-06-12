export interface Job {
    _id: string;
    company?: string;
    platform: string;
    jobType: string;
    locationType: string;
    jobLink: string;
    jobTitle: string;
    sharedExperience: string;
    actualExperience: string;
    country: string;
    city: string;
    salaryOffered: number;
    salaryExpected: number;
    currency: string;
    status: string;
    resumeLink: string;
    appliedDate: string; // string format for easy handling in form
    coverLetter?: string;
    isSalartPerAnnum: boolean;
    isActive: boolean;
}

export interface JobApplication extends Document {
    locationType: string;
    city?: string;
}
