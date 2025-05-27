"use client";

export default function Dashboard() {

    async function handleLogout() {
        await fetch("/api/signout", { method: "POST" });
        window.location.href = "/signin";
    }
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p>Welcome to your Job Manager control center 🎯</p>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                Signout
            </button>
        </div>
    );
}
