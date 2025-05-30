'use client';
import { useRouter, usePathname } from 'next/navigation';
import { IoIosArrowRoundBack } from 'react-icons/io';

type BackButtonProps = {
    fallback?: string;
};

export default function BackButton({ fallback = '/dashboard/jobs' }: BackButtonProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = () => {
        // Check if it's a new tab or direct navigation (e.g. /dashboard/jobs/new directly)
        const hasBrowserHistory = document.referrer && !document.referrer.includes(pathname);

        if (hasBrowserHistory) {
            router.back();
        } else {
            router.push(fallback);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="hover:underline flex items-center"
        >
            <IoIosArrowRoundBack className="text-xl" />
        </button>
    );
}
