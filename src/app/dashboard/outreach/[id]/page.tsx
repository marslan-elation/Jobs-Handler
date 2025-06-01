'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Outreach } from '@/types/outreach';
import BackButton from '@/components/BackButton';

export default function OutreachDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [outreach, setOutreach] = useState<Outreach | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchOutreach = async () => {
            try {
                const response = await fetch(`/api/outreach/${id}`);
                if (!response.ok) throw new Error('Outreach not found.');
                const data = await response.json();
                setOutreach(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch outreach');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOutreach();
    }, [id]);

    const handleChange = (field: keyof Outreach, value: string | boolean) => {
        if (!outreach) return;
        setOutreach({ ...outreach, [field]: value });
    };

    const handleSave = async () => {
        if (!outreach) return;
        try {
            const res = await fetch(`/api/outreach/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(outreach),
            });

            if (!res.ok) {
                throw new Error('Update failed');
            }

            alert('Outreach updated successfully');
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (isLoading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <BackButton fallback="/dashboard/outreach" />
                <h1 className="text-2xl font-bold">Edit Outreach</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                <label className="flex flex-col gap-1">
                    Company
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={outreach?.company || ""}
                        onChange={(e) => handleChange("company", e.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Platform
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={outreach?.platform || ""}
                        onChange={(e) => handleChange("platform", e.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Contact Name
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={outreach?.contactName || ""}
                        onChange={(e) => handleChange("contactName", e.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Contact Email
                    <input
                        type="email"
                        className="border p-2 rounded"
                        value={outreach?.contactEmail || ""}
                        onChange={(e) => handleChange("contactEmail", e.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Status
                    <select
                        className="border p-2 rounded"
                        value={outreach?.status || ""}
                        onChange={(e) => handleChange("status", e.target.value)}
                    >
                        {["Pending", "Contacted", "Responded", "No Response", "Closed"].map((status) => (
                            <option key={status}>{status}</option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col gap-1">
                    Contact Date
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={outreach?.contactDate?.substring(0, 10) || ""}
                        onChange={(e) => handleChange("contactDate", e.target.value)}
                    />
                </label>
                <label className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        checked={outreach?.isActive || false}
                        onChange={(e) => handleChange("isActive", e.target.checked)}
                    />
                    Active
                </label>
            </div>

            <div className="mt-6">
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
