'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewOutreachPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        subject: '',
        messageBody: '',
        contactEmail: '',
        company: '',
        jobRole: '',
        tags: '',
        status: 'Sent',
        followUpDate: '',
        responseDate: '',
        isActive: true,
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map((tag) => tag.trim()),
            };

            const response = await fetch('/api/outreach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to create outreach');
            }

            router.push('/dashboard/outreach');
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">New Outreach</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                <label className="flex flex-col gap-1">
                    Company
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        required
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Contact Email
                    <input
                        type="email"
                        className="border p-2 rounded"
                        value={formData.contactEmail}
                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                        required
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Subject
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Message Body
                    <textarea
                        className="border p-2 rounded"
                        value={formData.messageBody}
                        onChange={(e) => handleChange('messageBody', e.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Job Role
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={formData.jobRole}
                        onChange={(e) => handleChange('jobRole', e.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Tags (comma-separated)
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={formData.tags}
                        onChange={(e) => handleChange('tags', e.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Status
                    <select
                        className="border p-2 rounded"
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        {['Sent', 'Followed Up', 'Responded', 'Accepted', 'Rejected', 'No Reply'].map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-col gap-1">
                    Follow-Up Date
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={formData.followUpDate}
                        onChange={(e) => handleChange('followUpDate', e.target.value)}
                    />
                </label>
                <label className="flex flex-col gap-1">
                    Response Date
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={formData.responseDate}
                        onChange={(e) => handleChange('responseDate', e.target.value)}
                    />
                </label>
                <label className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleChange('isActive', e.target.checked)}
                    />
                    Active
                </label>
                <div className="md:col-span-2 mt-6">
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        {isSubmitting ? 'Submitting...' : 'Create Outreach'}
                    </button>
                </div>
            </form>
        </div>
    );
}
