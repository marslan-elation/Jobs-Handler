"use client";

import BackButton from "@/components/BackButton";
import JobApplicationSettings from "@/components/JobApplicationSettings";

export default function JobApplicationSettingsPage() {
    return (
        <div className="max-w-xl mx-auto p-6">
            <span className="flex items-center gap-2 mb-4">
                <BackButton fallback="/dashboard/settings" />
                <h1 className="text-2xl font-bold">Job Application Settings</h1>
            </span>
            <JobApplicationSettings />
        </div>
    );
}
