import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { siteOrigin } from "@/lib/origin";

const SCOPE = "read:user user:email public_repo";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const back = url.searchParams.get("back") || "/klaimku";
  const state = crypto.randomBytes(16).toString("base64url");
  const jar = await cookies();
  jar.set("sang_oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600 });
  jar.set("sang_oauth_back", back, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600 });

  const origin = await siteOrigin();
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID || "");
  authorize.searchParams.set("redirect_uri", `${origin}/api/auth/github/callback`);
  authorize.searchParams.set("scope", SCOPE);
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("allow_signup", "true");
  redirect(authorize.toString());
}
