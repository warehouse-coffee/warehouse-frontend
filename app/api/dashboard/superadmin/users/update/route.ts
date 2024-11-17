import { NextRequest, NextResponse } from "next/server";

import { cookieStore, tokenUtils } from "@/lib/auth";

import {
  SuperAdminClient,
  SwaggerException,
  UpdateUserCommand,
} from "../../../../web-api-client";

export async function PUT(request: NextRequest) {
  const token = cookieStore.get("auth_token");
  const xsrfToken = cookieStore.get("XSRF-TOKEN");

  if (!token || !tokenUtils.isValid(token) || !xsrfToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const updateUserData = Object.fromEntries(formData);

    // Create headers for the request
    const myHeaders = new Headers();
    myHeaders.append("X-XSRF-TOKEN", xsrfToken);
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append(
      "Cookie",
      `.AspNetCore.Antiforgery.oAXvPXlR1B8=${xsrfToken}`
    );
    const userId = request.nextUrl.searchParams.get('id');
      if (!userId) {
        return new Response('Missing user ID', { status: 400 });
      }
    // Extract form data from the request body
    const body = await request.formData();

    // Prepare the request options
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: body,
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(
      `https://coffeewarehouse.zapto.org/api/SuperAdmin/user/${userId}`,
      requestOptions
    );
    const result = await response.text();

    return new Response(result, {
      status: response.status,
      statusText: response.statusText,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
