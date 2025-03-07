import { NextRequest, NextResponse } from "next/server";
import { parseToken } from "./utils/parser";
import { decodeJwt } from "jose"; // 使用 jose 的 decodeJwt
import env from "@/core/env";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("Authorization");

  const token = parseToken(cookie?.value || "");

  // 使用 jose 的 decodeJwt 來解碼 token，不進行驗證
  const decode = token ? decodeJwt(token) : null;

  if (!decode) {
    const response = NextResponse.redirect(`${env.CLIENT_BASE}/login`);
    response.cookies.delete("Authorization");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/a/:path*",
};