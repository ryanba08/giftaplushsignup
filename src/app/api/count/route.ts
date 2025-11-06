// app/api/count/route.ts
import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export const dynamic = "force-dynamic";
// optional
export const runtime = "nodejs";

const DEFAULT = 208;

// Create the store only when we actually handle a request
function getBlobStore() {
    const name = "giftaplush-counters";
    // If you're running outside Netlify (or in local next dev), you can provide creds:
    const siteID = process.env.NETLIFY_SITE_ID;
    const token = process.env.NETLIFY_API_TOKEN;

    return siteID && token
        ? getStore({ name, siteID, token })
        : getStore({ name }); // Works on Netlify runtime where env is injected
}

async function readCount() {
    const store = getBlobStore();
    try {
        const raw = await store.get("signupCount"); // ArrayBuffer | null
        if (!raw) return DEFAULT;
        const val = new TextDecoder().decode(raw);
        const n = parseInt(val, 10);
        return Number.isFinite(n) ? n : DEFAULT;
    } catch {
        // If Blobs isn't available (e.g., build time), fall back without crashing the build
        return DEFAULT;
    }
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
    const store = getBlobStore();

    // naive increment (fine for light traffic; use Redis INCR if you need atomicity)
    const current = await readCount();
    const next = current + 1;

    try {
        await store.set("signupCount", String(next));
    } catch {
        // swallow errors so the endpoint still responds in environments without blobs
    }

    return noStoreJson({ ok: true, count: next });
}
