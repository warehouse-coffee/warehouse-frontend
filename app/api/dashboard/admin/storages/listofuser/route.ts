import { NextRequest, NextResponse } from "next/server";
import { cookieStore, tokenUtils } from "@/lib/auth";
import { StorageClient, Page } from "../../../../web-api-client";

export async function GET(request: NextRequest) {    
    const token = cookieStore.get("auth_token");

    if (!token || !tokenUtils.isValid(token)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const client = new StorageClient(process.env.NEXT_PUBLIC_BACKEND_API_URL, undefined, token, undefined);
        const { searchParams } = new URL(request.url);
        const pageNumber = parseInt(searchParams.get("pageNumber") || "");
        const size = parseInt(searchParams.get("size") || "");
        const page = new Page({
            pageNumber: pageNumber,
            size: size,
        });
        const result = await client.getStorageOfUser(page);
        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}

