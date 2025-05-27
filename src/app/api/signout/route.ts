import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out" });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/", // <- MUST match the original path
  });
  return response;
}
