'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Job } from '@/types/job';
import BackButton from '@/components/BackButton';
import { FaLink } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const JobDetailPage = () => {
    const params = useParams();
    const id = params.id as string;
    const [job, setJob] = useState<Job | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            fetch(`/api/jobs/${id}`)
                .then((res) => res.json())
                .then((data) => setJob(data))
                .catch((error) => console.error('Error fetching job:', error));
        }
    }, [id]);

    const updateField = async (field: string, value: Job[keyof Job]) => {
        if (!job) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/jobs/${job._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value }),
            });
            const updated = await res.json();
            setJob(updated);
        } catch (error) {
            console.error('Update error:', error);
        } finally {
            setUpdating(false);
        }
    };


    const updateActiveToggle = async () => {
        if (!job) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/jobs/${job._id}/toggle`, {
                method: 'PATCH',
            });
            const updated = await res.json();
            setJob(updated);
        } catch (error) {
            console.error("Toggle update error:", error);
        } finally {
            setUpdating(false);
        }
    };


    if (!job) return <div className="p-6 text-center">Loading job details...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <BackButton fallback="/dashboard/jobs" />
                <h1 className="text-3xl font-bold">{job.jobTitle}</h1>
            </div>

            {/* Main Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shadow rounded-lg p-6 border">
                <Info label="Company" value={job.company} />
                <Info label="Platform" value={job.platform} />
                <Info label="Job Type" value={job.jobType} />
                <Info label="Location" value={`${job.city}, ${job.country}`} />
                <Info label="Applied Date" value={new Date(job.appliedDate).toLocaleDateString()} />
                <Info label="Salary Offered" value={`${job.salaryOffered} ${job.currency}`} />
                <Info label="Salary Expected" value={`${job.salaryExpected} ${job.currency}`} />
                <Info label="Currency" value={job.currency} />
            </div>

            {/* Status & Active Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shadow rounded-lg p-6 border">
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Job Status</label>
                    <select
                        className="border rounded p-2 mt-1 text-sm bg-black text-white"
                        value={job.status}
                        disabled={updating}
                        onChange={(e) => updateField('status', e.target.value)}
                    >
                        {["Pending", "Interviewed", "Offered", "Rejected by Company", "Rejected by Me"].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-10 mt-2 md:mt-0">
                    <label className="text-sm font-medium">Active</label>
                    <button
                        type="button"
                        onClick={() => updateActiveToggle()}
                        disabled={updating}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${job.isActive ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${job.isActive ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shadow rounded-lg p-6 border">
                <InfoLinks label="Resume Link" value={<a href={job.resumeLink} target="_blank"><ImProfile /></a>} />
                <InfoLinks label="Job Link" value={<a href={job.jobLink} target="_blank"><FaLink /></a>} />
            </div>

            {/* Experience Section */}
            <div className=" shadow rounded-lg p-6 border space-y-2">
                <h2 className="text-lg font-semibold">Experience</h2>
                <p><strong>Shared Experience:</strong> {job.sharedExperience}</p>
                <p><strong>Actual Experience:</strong> {job.actualExperience}</p>
                {job.coverLetter && <p><strong>Cover Letter:</strong> {job.coverLetter}</p>}
                <p><strong>Salary Per Annum:</strong> {job.isSalartPerAnnum ? 'Yes' : 'No'}</p>
            </div>

            {/* Cover Letter */}
            {job.coverLetter &&
                <div className=" shadow rounded-lg p-6 border space-y-2">
                    <h2 className="text-lg font-semibold">Cover Letter</h2>
                    <p>{job.coverLetter}</p>
                </div>}
        </div>
    );
};

// Reusable Info Component
const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
        <p className="text-sm">{label}</p>
        <p className="font-medium">{value}</p>
    </div>
);

const InfoLinks = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className='flex items-center gap-10'>
        <p className="text-sm">{label}</p>
        <p className="font-medium">{value}</p>
    </div>
);

export default JobDetailPage;
