"use client";

import BackButton from "@/components/BackButton";
import Link from "next/link";

export default function SettingsPage() {
    return (
        <div className="max-w-xl mx-auto p-6">
            <span className="flex items-center gap-2 mb-4">
                <BackButton fallback="/dashboard" />
                <h1 className="text-2xl font-bold">Settings</h1>
            </span>
            <div className="bg-black border border-white text-white p-4 rounded-md shadow">
                <Link
                    href="/dashboard/settings/job-application"
                    className="hover:text-blue-500"
                >
                    <h2 className="text-sm font-semibold mb-2">Job Application Settings</h2>
                </Link>
            </div>
        </div>
    );
}
