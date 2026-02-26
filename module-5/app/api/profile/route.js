import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request) {
  const headerList = await headers();
  const authHeader = headerList.get("Authorization");

  console.log("Auth Header", authHeader);

  const response = NextResponse.json({ message: "Hello with headers" });

  response.headers.set("X-Powered-By-Suraj", "Next.js 15");
  response.headers.set("Cache-Control", "no-store");

  return response;
}
