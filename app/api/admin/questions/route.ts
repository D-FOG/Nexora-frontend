import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.NEXORA_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function POST(request: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  const dashboardPassword = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!adminKey || !dashboardPassword) return NextResponse.json({ error: { message: "The administrator environment is not configured." } }, { status: 500 });
  if (request.headers.get("x-admin-dashboard-password") !== dashboardPassword) {
    return NextResponse.json({ error: { message: "Administrator password is incorrect." } }, { status: 401 });
  }

  const body = await request.text();
  let response: Response;
  try {
    response = await fetch(`${apiUrl}/admin/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-api-key": adminKey },
      body,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: { message: "The quiz API could not be reached." } }, { status: 502 });
  }
  const payload = await response.json().catch(() => ({ error: { message: "The quiz API returned an invalid response." } }));
  return NextResponse.json(payload, { status: response.status });
}

export async function GET(request: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY, dashboardPassword = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!adminKey || !dashboardPassword) return NextResponse.json({ error: { message: "The administrator environment is not configured." } }, { status: 500 });
  if (request.headers.get("x-admin-dashboard-password") !== dashboardPassword) return NextResponse.json({ error: { message: "Administrator password is incorrect." } }, { status: 401 });
  const response = await fetch(`${apiUrl}/admin/questions`, { headers: { "x-admin-api-key": adminKey }, cache: "no-store" });
  return NextResponse.json(await response.json(), { status: response.status });
}
