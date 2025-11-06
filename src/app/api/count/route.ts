// app/api/count/route.ts
import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DEFAULT = 208;

function getBlobStore() {
    const name = "giftaplush-counters";
    const siteID = process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_API_TOKEN;
    return siteID && token ? getStore({ name, siteID, token }) : getStore({ name });
}

function json(body: unknown) {
    return new NextResponse(JSON.stringify(body), {
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
}

async function readCount() {
    const store = getBlobStore();
    try {
        const val = await store.get("signupCount", { type: "text" });
        if (!val) return DEFAULT;

        // tolerate either plain number or {"count": N}
        const num = Number(val.trim());
        if (Number.isFinite(num)) return num;

        try {
            const obj = JSON.parse(val);
            const n = Number(obj?.count);
            return Number.isFinite(n) ? n : DEFAULT;
        } catch {
            return DEFAULT;
        }
    } catch {
        return DEFAULT;
    }
}

export async function GET() {
    const count = await readCount();
    return json({ ok: true, count });
}

export async function POST() {
    const store = getBlobStore();
    const current = await readCount();
    const next = current + 1;

    try {
        await store.set("signupCount", String(next)); // write as plain text
    } catch (e) {
        return json({ ok: true, count: current, persisted: false, err: String(e) });
    }

    return json({ ok: true, count: next, persisted: true });
}
