import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { mode, token } = await request.json();

  const response = NextResponse.json({ success: true });

  // SET TOKEN
  if (mode === "set") {
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Token is missing or invalid" },
        { status: 400 }
      );
    }

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  }

  // CLEAR TOKEN
  if (mode === "clear") {
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  }

  return NextResponse.json(
    { success: false, message: "Invalid mode" },
    { status: 400 }
  );
}
