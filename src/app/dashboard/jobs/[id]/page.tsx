'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Job } from '@/types/job';
import BackButton from '@/components/BackButton';

const JobDetailPage = () => {
    const params = useParams();
    const id = params.id as string; // 👈 make sure it's a string
    const [job, setJob] = useState<Job | null>(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/jobs/${id}`)
                .then((res) => res.json())
                .then((data) => setJob(data))
                .catch((error) => console.error('Error fetching job:', error));
        }
    }, [id]);

    if (!job) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <BackButton />
            <h1 className="text-2xl font-bold mb-4">{job.jobTitle}</h1>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Platform:</strong> {job.platform}</p>
            <p><strong>Job Type:</strong> {job.jobType}</p>
            <p><strong>Location:</strong> {job.city}, {job.country}</p>
            <p><strong>Salary Offered:</strong> {job.salaryOffered} {job.currency}</p>
            <p><strong>Salary Expected:</strong> {job.salaryExpected} {job.currency}</p>
            <p><strong>Status:</strong> {job.status}</p>
            <p><strong>Applied Date:</strong> {new Date(job.appliedDate).toLocaleDateString()}</p>
            <p><strong>Resume Link:</strong> <a href={job.resumeLink} target="_blank" rel="noopener noreferrer">{job.resumeLink}</a></p>
            <p><strong>Job Link:</strong> <a href={job.jobLink} target="_blank" rel="noopener noreferrer">{job.jobLink}</a></p>
            <p><strong>Shared Experience:</strong> {job.sharedExperience}</p>
            <p><strong>Actual Experience:</strong> {job.actualExperience}</p>
            {job.coverLetter && <p><strong>Cover Letter:</strong> {job.coverLetter}</p>}
            <p><strong>Is Salary Per Annum:</strong> {job.isSalartPerAnnum ? 'Yes' : 'No'}</p>
            <p><strong>Is Active:</strong> {job.isActive ? 'Yes' : 'No'}</p>
        </div>
    );
};

export default JobDetailPage;
