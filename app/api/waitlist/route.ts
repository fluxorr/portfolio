import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export async function POST(request: Request) {
  const endpoint = process.env.MEMOIR_WAITLIST_ENDPOINT;
  if (!endpoint)
    return NextResponse.json(
      { message: "The Memoir waitlist isn’t connected." },
      { status: 503 },
    );

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Enter a valid email address." },
      { status: 400 },
    );
  }
  const field =
    payload && typeof payload === "object" && "email" in payload
      ? payload.email
      : null;
  const email = typeof field === "string" ? field.trim() : "";
  if (email.length > 254 || !emailPattern.test(email))
    return NextResponse.json(
      { message: "Enter a valid email address." },
      { status: 400 },
    );

  const headers = new Headers({
    "Content-Type": "application/json",
    "Idempotency-Key": createHash("sha256")
      .update(email.toLowerCase())
      .digest("hex"),
  });
  if (process.env.MEMOIR_WAITLIST_TOKEN)
    headers.set("Authorization", `Bearer ${process.env.MEMOIR_WAITLIST_TOKEN}`);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, source: "memoir" }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok)
      return NextResponse.json({
        message: "Your email was added to the Memoir waitlist.",
      });
    if (response.status === 409)
      return NextResponse.json({
        message: "This email is already on the Memoir waitlist.",
      });
  } catch {
    // The upstream provider owns availability and durable storage.
  }
  return NextResponse.json(
    { message: "We couldn’t submit your email. Try again in a moment." },
    { status: 502 },
  );
}
