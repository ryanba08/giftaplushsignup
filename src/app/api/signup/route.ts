import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { email, hp }: { email?: string; hp?: string } = await req.json();

        // Honeypot + basic validation
        if (hp) return NextResponse.json({ ok: true });
        if (!email || typeof email !== "string")
            return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });

        const API_KEY = process.env.MAILCHIMP_API_KEY!;
        const DC = process.env.MAILCHIMP_SERVER_PREFIX!;
        const LIST_ID = process.env.MAILCHIMP_LIST_ID!;
        if (!API_KEY || !DC || !LIST_ID)
            return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });

        const url = `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;
        const auth = Buffer.from(`anystring:${API_KEY}`).toString("base64");

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email_address: email,
                status: "subscribed",
            }),
        });

        const data = await res.json();

        // Treat "Member Exists" as success for UX
        if (!res.ok && data?.title !== "Member Exists") {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/count`, { method: "POST" });
            return NextResponse.json({ ok: false, error: data?.detail || "Mailchimp error" }, { status: 400 });
        }

        return NextResponse.json({ ok: true });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
