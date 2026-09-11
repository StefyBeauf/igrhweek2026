import { NextRequest, NextResponse } from "next/server";
import { getStoredJSON, setStoredJSON } from "@/lib/store";

// The Google Apps Script backend can take up to ~10-15s to respond from
// Vercel's servers; give the function enough room to wait it out.
export const maxDuration = 25;

const ALLOWED_KEYS = ["notes-cc", "partiel", "comments"];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  if (!ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: "invalid key" }, { status: 400 });
  }
  const data = await getStoredJSON(key, null);
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  if (!ALLOWED_KEYS.includes(key)) {
    return NextResponse.json({ error: "invalid key" }, { status: 400 });
  }
  const body = await req.json();
  const ok = await setStoredJSON(key, body);
  return NextResponse.json({ ok });
}
