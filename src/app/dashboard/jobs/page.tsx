"use client";

import useSWR from "swr";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Job } from "../../types/job";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function JobsDashboard() {
    const router = useRouter();
    const { data: jobs, mutate } = useSWR("/api/jobs", fetcher);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        company: "",
        platform: "",
        jobType: "",
        status: "",
        city: "",
        country: "",
    });
    const [sortKey, setSortKey] = useState<keyof Job>("appliedDate");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const tableHeaders = [
        'Sr. No', 'Company', 'Platform', 'Job Type', 'Job Link', 'Job Title',
        'Shared Experience', 'Resume (Drive Link)',
        'Country', 'City', 'Salary Offered', 'Salary Expected', 'Currency',
        'Status', 'Applied Date', 'Days Since Applied', 'Active', 'Delete'
    ];

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

    const handleRowDoubleClick = (id: string) => {
        router.push(`/dashboard/jobs/${id}`);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">📋 Job Applications</h1>
                <Link
                    href="/dashboard/jobs/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    Add Job
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <input type="text" placeholder="Company" className="border p-2 rounded" onChange={(e) => setFilters({ ...filters, company: e.target.value })} />
                <input type="text" placeholder="Platform" className="border p-2 rounded" onChange={(e) => setFilters({ ...filters, platform: e.target.value })} />
                <select className="border p-2 rounded shadow-sm bg-black text-white" onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}>
                    <option value="">All Types</option>
                    {["Remote", "Onsite", "Hybrid", "Contract", "Freelance", "Part-time", "Full-time"].map(type => <option key={type}>{type}</option>)}
                </select>
                <select className="border p-2 rounded shadow-sm bg-black text-white" onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                    <option value="">All Statuses</option>
                    {["Pending", "Interviewed", "Offered", "Rejected by Company", "Rejected by Me"].map(status => <option key={status}>{status}</option>)}
                </select>
            </div>

            {/* Scrollable table wrapper */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <table className="table-auto min-w-[2200px] border text-sm whitespace-nowrap">
                    <thead role="rowgroup" className="bg-gray-100 text-black">
                        <tr role="row">
                            {tableHeaders.map((header, i) => (
                                <th
                                    role="columnheader"
                                    key={header}
                                    className="border px-4 py-2 cursor-pointer"
                                    onClick={() => {
                                        const key = columns[i].key;
                                        if (sortKey === key) {
                                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                        } else {
                                            setSortKey(key as keyof Job);
                                            setSortOrder("asc");
                                        }
                                    }}
                                >
                                    {header}
                                    {sortKey === columns[i].key && (sortOrder === "asc" ? " 🔼" : " 🔽")}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody role="rowgroup">
                        {jobs?.filter((job: Job) =>
                            (!filters.company || job.company?.toLowerCase().includes(filters.company.toLowerCase())) &&
                            (!filters.platform || job.platform?.toLowerCase().includes(filters.platform.toLowerCase())) &&
                            (!filters.jobType || job.jobType === filters.jobType) &&
                            (!filters.status || job.status === filters.status) &&
                            (!filters.city || job.city?.toLowerCase().includes(filters.city.toLowerCase())) &&
                            (!filters.country || job.country?.toLowerCase().includes(filters.country.toLowerCase()))
                        )
                            ?.sort((a: Job, b: Job) => {
                                const valA = a[sortKey as keyof Job];
                                const valB = b[sortKey as keyof Job];

                                if (valA == null) return 1;
                                if (valB == null) return -1;

                                if (valA > valB) return sortOrder === "asc" ? 1 : -1;
                                if (valA < valB) return sortOrder === "asc" ? -1 : 1;
                                return 0;

                            })
                            ?.map((job: any, index: number) => (
                                <tr
                                    role="row"
                                    key={job._id}
                                    tabIndex={0}
                                    onDoubleClick={() => handleRowDoubleClick(job._id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            router.push(`/dashboard/jobs/${job._id}`);
                                        }
                                    }}
                                    className="cursor-pointer hover:bg-blue-600 transition-colors">
                                    {columns.map((col) => (
                                        <td role="cell" key={col.key} className="border px-4 py-2">
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
