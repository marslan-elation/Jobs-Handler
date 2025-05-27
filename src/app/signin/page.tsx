"use client";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signed in! Token: " + data.token);
      // Store token or redirect
    } else {
      alert("Error: " + data.error);
    }
  }

  return (
    <form onSubmit={handleSignIn} className="p-6 space-y-4 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full" />
      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign In
      </button>
    </form>
  );
}
