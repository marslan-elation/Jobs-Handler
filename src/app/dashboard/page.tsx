'use client';

import { useRouter } from 'next/navigation';

import { RiContractFill } from "react-icons/ri";
import { FaFileContract } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";

export default function DashboardLayout() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/signout", { method: "POST" });
        window.location.href = "/signin";
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">
                <div>
                    <div className="p-6 text-2xl font-bold border-b border-gray-700">
                        Job Manager
                    </div>
                    <nav className="p-4 space-y-2">
                        <button
                            onClick={() => router.push('/dashboard/jobs')}
                            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
                        >
                            <span className='flex ite gap-2'>
                                <RiContractFill />Applied Jobs
                            </span>
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/outreach')}
                            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
                        >
                            <span className='flex ite gap-2'>
                                <FaFileContract />Applied Outreach
                            </span>
                        </button>
                        <button
                            onClick={() => alert('Settings not implemented yet')}
                            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition mt-4"
                        >
                            <span className='flex ite gap-2'>
                                <IoSettings />Settings
                            </span>
                        </button>
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                    >
                        🚪 Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                <p>Welcome to your Job Manager control center 🎯</p>
            </main>
        </div>
    );
}
