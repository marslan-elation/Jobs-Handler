"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from '@/components/BackButton';

export default function NewJobPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [currencies, setCurrencies] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchCurrencies = async () => {
            const res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json");
            const data = await res.json();
            setCurrencies(data);
        };
        fetchCurrencies();
    }, []);


    const [form, setForm] = useState({
        company: "",
        jobTitle: "",
        platform: "",
        jobType: "Remote",
        jobLink: "",
        sharedExperience: "",
        actualExperience: "",
        resumeLink: "",
        appliedDate: new Date().toISOString().substring(0, 10),
        city: "",
        country: "",
        salaryOffered: "",
        salaryExpected: "",
        currency: "",
        status: "Pending",
        coverLetter: "",
        isSalartPerAnnum: true,
        isActive: true,
    });

    const jobTypes = ['Remote', 'Onsite', 'Hybrid', 'Contract', 'Freelance', 'Part-time', 'Full-time'];
    const applicationStatus = ['Pending', 'Interviewed', 'Offered', 'Rejected by Company', 'Rejected by Me'];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            setForm({ ...form, [name]: e.target.checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const requiredFields = [
            "jobTitle", "platform", "jobType", "jobLink", "sharedExperience",
            "actualExperience", "resumeLink", "appliedDate", "city", "country",
            "salaryOffered", "salaryExpected", "currency", "status"
        ];

        for (const field of requiredFields) {
            if (!form[field as keyof typeof form]) {
                alert(`Please fill in the required field: ${field}`);
                return;
            }
        }

        setLoading(true);
        await fetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        router.push("/dashboard/jobs");
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <span className="flex items-center gap-2 mb-4">
                <BackButton fallback="/dashboard/jobs" />
                <h1 className="text-2xl font-bold">Add New Job Application</h1>
            </span>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Company Name (optional)" name="company" value={form.company} onChange={handleChange} />
                    <Input label="Job Title" name="jobTitle" value={form.jobTitle} onChange={handleChange} required />

                    <Input label="Platform Used" name="platform" value={form.platform} onChange={handleChange} required />
                    <Select label="Job Type" name="jobType" value={form.jobType} onChange={handleChange} options={jobTypes} />

                    <Input label="City" name="city" value={form.city} onChange={handleChange} required />
                    <Input label="Country" name="country" value={form.country} onChange={handleChange} required />

                    <Input label="Salary Offered" name="salaryOffered" value={form.salaryOffered} onChange={handleChange} required />
                    <Input label="Salary Expected" name="salaryExpected" value={form.salaryExpected} onChange={handleChange} required />

                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="currency">Currency</label>
                        <select
                            id="currency"
                            name="currency"
                            value={form.currency}
                            onChange={handleChange}
                            required
                            className="w-full border px-3 py-2 rounded-md shadow-sm bg-black text-white"
                        >
                            <option value="">Select Currency</option>
                            {Object.entries(currencies).map(([code, name]) => (
                                <option key={code} value={code.toUpperCase()}>
                                    {code.toUpperCase()} - {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input label="Applied Date" name="appliedDate" type="date" value={form.appliedDate} onChange={handleChange} required />
                </div>

                <Input label="Job Link" name="jobLink" type="url" value={form.jobLink} onChange={handleChange} required />
                <Input label="Resume Google Drive Link" name="resumeLink" type="url" value={form.resumeLink} onChange={handleChange} required />

                <Textarea label="Shared Experience" name="sharedExperience" value={form.sharedExperience} onChange={handleChange} required />
                <Textarea label="Actual Experience" name="actualExperience" value={form.actualExperience} onChange={handleChange} required />
                <Textarea label="Cover Letter (optional)" name="coverLetter" value={form.coverLetter} onChange={handleChange} />

                <Select label="Application Status" name="status" value={form.status} onChange={handleChange} options={applicationStatus} />

                <div className="flex items-center gap-2">
                    <input type="checkbox" id="isSalartPerAnnum" name="isSalartPerAnnum" checked={form.isSalartPerAnnum} onChange={handleChange} />
                    <label htmlFor="isSalartPerAnnum">Is Salary Per Annum?</label>
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" id="isActive" name="isActive" checked={form.isActive} onChange={handleChange} />
                    <label htmlFor="isActive">Is Active?</label>
                </div>

                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    {loading ? "Submitting..." : "Add Job"}
                </button>
            </form>
        </div>
    );
}

// Reusable Input Component
function Input({ label, name, value, onChange, type = "text", required = false }: any) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full border px-3 py-2 rounded-md shadow-sm"
            />
        </div>
    );
}

// Reusable Textarea Component
function Textarea({ label, name, value, onChange, required = false }: any) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}</label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                rows={3}
                required={required}
                className="w-full border px-3 py-2 rounded-md shadow-sm"
            />
        </div>
    );
}

// Reusable Select Component
function Select({ label, name, value, onChange, options }: any) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}</label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded-md shadow-sm bg-black text-white"
            >
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
}
