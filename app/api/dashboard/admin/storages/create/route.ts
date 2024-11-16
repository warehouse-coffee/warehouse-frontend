import { NextRequest, NextResponse } from "next/server";
import { cookieStore, tokenUtils } from "@/lib/auth";
import { StorageClient, Page } from "../../../../web-api-client";


export async function POST(request: NextRequest) {
    const token = cookieStore.get("auth_token");

    if (!token || !tokenUtils.isValid(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const client = new StorageClient(process.env.NEXT_PUBLIC_BACKEND_API_URL, undefined, token, undefined);
        const data = await request.json();
        const result = await client.createStorage(data);
        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}