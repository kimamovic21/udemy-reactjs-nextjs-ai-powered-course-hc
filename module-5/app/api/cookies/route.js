import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const cookieStore = await cookies();

  cookieStore.delete("score");

  return NextResponse.json({ message: "Cookie deleted!" });
}
