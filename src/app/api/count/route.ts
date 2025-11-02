import { NextResponse } from "next/server";

let signupCount = 208;

export async function GET() {
    return NextResponse.json({ ok: true, count: signupCount });
}

export async function POST() {
    signupCount += 1;
    return NextResponse.json({ ok: true, count: signupCount });
}