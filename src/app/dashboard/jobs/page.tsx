"use client";

import useSWR from "swr";
import { useState } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function JobsDashboard() {
    const { data: jobs, mutate } = useSWR("/api/jobs", fetcher);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const tableHeaders = [
        'Sr. No', 'Company', 'Platform', 'Job Type', 'Job Link', 'Job Title',
        'Shared Experience', 'Resume (Drive Link)',
        'Country', 'City', 'Salary Offered', 'Salary Expected', 'Currency',
        'Status', 'Applied Date', 'Days Since Applied', 'Active', 'Delete'
    ];

    const calculateDaysSince = (date: string) => {
        const applied = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - applied.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const columns = [
        { key: 'srNo', render: (_: any, index: number) => index + 1 },
        { key: 'company', render: (job: any) => job.company },
        { key: 'platform', render: (job: any) => job.platform },
        { key: 'jobType', render: (job: any) => job.jobType },
        {
            key: 'jobLink',
            render: (job: any) => (
                <Link href={job.jobLink} target="_blank">
                    <ExternalLink className="inline w-4 h-4 text-blue-500" />
                </Link>
            ),
        },
        { key: 'jobTitle', render: (job: any) => job.jobTitle },
        { key: 'sharedExperience', render: (job: any) => job.sharedExperience },
        {
            key: 'resumeLink',
            render: (job: any) => (
                <Link href={job.resumeLink} target="_blank">
                    <ExternalLink className="inline w-4 h-4 text-green-600" />
                </Link>
            ),
        },
        { key: 'country', render: (job: any) => job.country },
        { key: 'city', render: (job: any) => job.city },
        { key: 'salaryOffered', render: (job: any) => `${job.salaryOffered} ${job.currency}` },
        { key: 'salaryExpected', render: (job: any) => `${job.salaryExpected} ${job.currency}` },
        { key: 'currency', render: (job: any) => job.currency },
        { key: 'status', render: (job: any) => job.status },
        {
            key: 'appliedDate',
            render: (job: any) => new Date(job.appliedDate).toLocaleDateString(),
        },
        {
            key: 'daysSinceApplied',
            render: (job: any) => {
                const applied = new Date(job.appliedDate);
                const today = new Date();
                const diff = Math.floor((today.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24));
                return `${diff} days`;
            },
        },
        {
            key: 'isActive',
            render: (job: any) => (
                <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={job.isActive}
                    onChange={() => toggleJob(job._id)}
                    disabled={loadingId === job._id}
                />
            ),
        },
        {
            key: 'delete',
            render: (job: any) => (
                <button
                    onClick={() => deleteJob(job._id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={loadingId === job._id}
                >
                    <Trash2 className="w-4 h-4 inline" />
                </button>
            ),
        },
    ];

    const toggleJob = async (id: string) => {
        setLoadingId(id);
        await fetch(`/api/jobs/${id}/toggle`, { method: "PATCH" });
        mutate();
        setLoadingId(null);
    };

    const deleteJob = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        setLoadingId(id);
        await fetch(`/api/jobs/${id}`, { method: "DELETE" });
        mutate();
        setLoadingId(null);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">📋 Job Applications</h1>
                <Link
                    href="/dashboard/jobs/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    ➕ Add Job
                </Link>
            </div>

            {/* Scrollable table wrapper */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <table className="table-auto min-w-[2200px] border text-sm whitespace-nowrap">
                    <thead className="bg-gray-100 text-black">
                        <tr>
                            {tableHeaders.map((header) => (
                                <th key={header} className="border px-4 py-2 font-semibold text-left">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {jobs?.map((job: any, index: number) => (
                            <tr key={job._id}>
                                {columns.map((col) => (
                                    <td key={col.key} className="border px-4 py-2">
                                        {col.render(job, index)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}
