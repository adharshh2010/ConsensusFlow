import { NextResponse } from "next/server";

import { LoginSchema } from "@/schema/auth";
import { login } from "@/actions/login";

export async function POST(req: Request) {
  const res = NextResponse;
  try {
    const data = await req.json();

    const apiDataValidation = LoginSchema.parse(data);

    if (!apiDataValidation) {
      return res.json(
        { error: `Server Couldn't Verify Requested Data Try Again!` },
        { status: 417 }
      );
    }

    const apiData = apiDataValidation;

    try {
      try {
        return await login(apiData).then((data) => {
          if (data?.error) {
            return res.json(
              { error: `${data.error}` },
              { status: data.status }
            );
          }
          if (data.success) {
            return res.json(
              {
                success: `${data.success}`,
                description: `${data.description}`,
              },
              { status: data.status }
            );
          }
          return res.json(
            {
              error: `Server didn't return any message! Check the status code for more ${data.status}`,
            },
            { status: data.status }
          );
        });
      } catch {
        return res.json(
          { error: "The server is currently unable to handle the request." },
          { status: 503 }
        );
      }
    } catch {
      return res.json(
        {
          error: `Something Went Wrong While Handling The Request`,
        },
        { status: 500 }
      );
    }
  } catch {
    return res.json(
      {
        error: "Internal Server Error!",
      },
      { status: 500 }
    );
  }
}
