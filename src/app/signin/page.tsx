"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "An error occurred.");
    }
  }

  return (
    <form onSubmit={handleSignIn} className="max-w-sm mx-auto mt-10 p-4 space-y-4 border rounded shadow">
      <h1 className="text-2xl font-bold text-center">Sign In</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Username or Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Sign In
      </button>
    </form>
  );
}
