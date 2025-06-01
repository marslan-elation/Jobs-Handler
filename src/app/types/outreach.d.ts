export interface Outreach {
    _id: string;
    subject?: string;
    messageBody?: string;
    contactEmail: string;
    company: string;
    jobRole?: string;
    tags?: string[];
    status: 'Sent' | 'Followed Up' | 'Responded' | 'Accepted' | 'Rejected' | 'No Reply';
    followUpDate?: string;
    responseDate?: string;
    isActive: boolean;
    logs?: {
        message: string;
        timestamp: string;
        type: 'Sent' | 'Response' | 'Follow-Up';
    }[];
    user?: string;
    createdAt: string;
    updatedAt: string;
}