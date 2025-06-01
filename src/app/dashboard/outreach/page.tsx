"use client";

import useSWR from "swr";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Outreach } from "@/types/outreach";
import BackButton from '@/components/BackButton';
import { FaSortDown, FaSortUp } from "react-icons/fa";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function OutreachDashboard() {
    const router = useRouter();
    const { data: outreaches, mutate } = useSWR("/api/outreach", fetcher);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        company: "",
        platform: "",
        status: "",
    });
    const [sortKey, setSortKey] = useState<keyof Outreach>("contactDate");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [showAll, setShowAll] = useState(false);

    const tableHeaders = [
        'Sr. No', 'Company', 'Platform', 'Contact Person', 'Contact Email', 'Status',
        'Contact Date', 'Days Since Contacted', 'Active', 'Delete'
    ];

    const columns = [
        { key: 'srNo', render: (_: any, index: number) => index + 1 },
        { key: 'company', render: (outreach: Outreach) => outreach.company },
        { key: 'platform', render: (outreach: Outreach) => outreach.platform },
        { key: 'contactName', render: (outreach: Outreach) => outreach.contactName },
        { key: 'contactEmail', render: (outreach: Outreach) => outreach.contactEmail },
        { key: 'status', render: (outreach: Outreach) => outreach.status },
        {
            key: 'contactDate',
            render: (outreach: Outreach) => new Date(outreach.contactDate).toLocaleDateString(),
        },
        {
            key: 'daysSinceContacted',
            render: (outreach: Outreach) => {
                const contacted = new Date(outreach.contactDate);
                const today = new Date();
                const diff = Math.floor((today.getTime() - contacted.getTime()) / (1000 * 60 * 60 * 24));
                return `${diff} days`;
            },
        },
        {
            key: 'isActive',
            render: (outreach: Outreach) => (
                <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={outreach.isActive}
                    onChange={() => toggleOutreach(outreach._id)}
                    disabled={loadingId === outreach._id}
                />
            ),
        },
        {
            key: 'delete',
            render: (outreach: Outreach) => (
                <button
                    onClick={() => deleteOutreach(outreach._id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={loadingId === outreach._id}
                >
                    <Trash2 className="w-4 h-4 inline" />
                </button>
            ),
        },
    ];

    const toggleOutreach = async (id: string) => {
        setLoadingId(id);
        await fetch(`/api/outreach/${id}/toggle`, { method: "PATCH" });
        mutate();
        setLoadingId(null);
    };

    const deleteOutreach = async (id: string) => {
        if (!confirm("Are you sure you want to delete this outreach?")) return;
        setLoadingId(id);
        await fetch(`/api/outreach/${id}`, { method: "DELETE" });
        mutate();
        setLoadingId(null);
    };

    const handleRowDoubleClick = (id: string) => {
        router.push(`/dashboard/outreach/${id}`);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-2">
                    <BackButton fallback="/dashboard" />
                    <h1 className="text-2xl font-bold">Outreach Contacts</h1>
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAll(prev => !prev)}
                        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md text-sm font-medium"
                    >
                        {showAll ? "Show Only Active" : "Show All"}
                    </button>
                    <Link
                        href="/dashboard/outreach/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        Add Outreach
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <input type="text" placeholder="Company" className="border p-2 rounded" onChange={(e) => setFilters({ ...filters, company: e.target.value })} />
                <input type="text" placeholder="Platform" className="border p-2 rounded" onChange={(e) => setFilters({ ...filters, platform: e.target.value })} />
                <select className="border p-2 rounded shadow-sm bg-black text-white" onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                    <option value="">All Statuses</option>
                    {["Pending", "Contacted", "Responded", "No Response", "Closed"].map(status => <option key={status}>{status}</option>)}
                </select>
            </div>

            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                <table className="table-auto min-w-[1800px] border text-sm whitespace-nowrap">
                    <thead role="rowgroup" className="bg-gray-100 text-black">
                        <tr role="row">
                            {tableHeaders.map((header, i) => (
                                <th
                                    role="columnheader"
                                    key={header}
                                    className="border px-4 py-2 cursor-pointer"
                                    onClick={() => {
                                        let key = columns[i].key;
                                        if (key === 'daysSinceContacted') {
                                            key = 'contactDate';
                                        }
                                        if (sortKey === key) {
                                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                        } else {
                                            setSortKey(key as keyof Outreach);
                                            setSortOrder("asc");
                                        }
                                    }}
                                >
                                    <span className="flex items-center gap-1">
                                        {header}
                                        {(columns[i].key === sortKey ||
                                            (columns[i].key === 'daysSinceContacted' && sortKey === 'contactDate')) &&
                                            (sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />)}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody role="rowgroup">
                        {outreaches?.filter((outreach: Outreach) =>
                            (!showAll ? outreach.isActive : true) &&
                            (!filters.company || outreach.company?.toLowerCase().includes(filters.company.toLowerCase())) &&
                            (!filters.platform || outreach.platform?.toLowerCase().includes(filters.platform.toLowerCase())) &&
                            (!filters.status || outreach.status === filters.status)
                        )
                            ?.sort((a: Outreach, b: Outreach) => {
                                const valA = a[sortKey as keyof Outreach];
                                const valB = b[sortKey as keyof Outreach];

                                if (valA == null) return 1;
                                if (valB == null) return -1;

                                if (valA > valB) return sortOrder === "asc" ? 1 : -1;
                                if (valA < valB) return sortOrder === "asc" ? -1 : 1;
                                return 0;

                            })
                            ?.map((outreach: Outreach, index: number) => (
                                <tr
                                    role="row"
                                    key={outreach._id}
                                    tabIndex={0}
                                    onDoubleClick={() => handleRowDoubleClick(outreach._id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            router.push(`/dashboard/outreach/${outreach._id}`);
                                        }
                                    }}
                                    className="cursor-pointer hover:bg-blue-600 transition-colors">
                                    {columns.map((col) => (
                                        <td role="cell" key={col.key} className="border px-4 py-2">
                                            {col.render(outreach, index)}
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
