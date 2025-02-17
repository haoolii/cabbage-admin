import { NextRequest, NextResponse } from "next/server";
import { parseToken } from "./utils/parser";
import jwt from "jsonwebtoken";
import env from "@/core/env";

export function middleware(request: NextRequest) {

  const cookie = request.cookies.get("Authorization");

  console.log("cookie", cookie?.value);

  const token = parseToken(cookie?.value || "");

  const decode = jwt.decode(token || "");
  
  if (!decode) {
    const response = NextResponse.redirect(`${env.CLIENT_BASE}/login`);
    response.cookies.delete("Authorization")
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/a/:path*",
};
