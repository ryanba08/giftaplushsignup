// app/api/count/route.ts
import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";


export const dynamic = "force-dynamic";


const store = getStore({ name: "giftaplush-counters" });
const DEFAULT = 208;

async function readCount() {
    const raw = await store.get("signupCount"); // ArrayBuffer | null
    if (!raw) return DEFAULT;
    const val = new TextDecoder().decode(raw);
    const n = parseInt(val, 10);
    return Number.isFinite(n) ? n : DEFAULT;
}

function noStoreJson(body: unknown): NextResponse {
    return new NextResponse(JSON.stringify(body), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, no-cache, must-revalidate",
        },
    });
}

export async function GET() {
    const count = await readCount();
    return noStoreJson({ ok: true, count });
}

export async function POST() {
    // naive increment (fine for light traffic; switch to Redis INCR for heavy writes)
    const current = await readCount();
    const next = current + 1;
    await store.set("signupCount", String(next));
    return noStoreJson({ ok: true, count: next });
}
