import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { saveClaimUser, setSession } from "@/lib/auth";
import { siteOrigin } from "@/lib/origin";

export const dynamic = "force-dynamic";

async function gh(pathname: string, token: string) {
  const res = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "sang-ceo-registry",
    },
    cache: "no-store",
  });
  return res.json();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const jar = await cookies();
  const expect = jar.get("sang_oauth_state")?.value;
  const back = jar.get("sang_oauth_back")?.value || "/klaimku";
  jar.delete("sang_oauth_state");
  jar.delete("sang_oauth_back");

  if (!code || !state || state !== expect) redirect("/klaimku?gagal=state");

  const origin = await siteOrigin();
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${origin}/api/auth/github/callback`,
    }),
    cache: "no-store",
  });
  const tokenData = (await tokenRes.json()) as { access_token?: string };
  if (!tokenData.access_token) redirect("/klaimku?gagal=token");

  const token = tokenData.access_token as string;
  const user = await gh("/user", token);
  if (!user?.login) redirect("/klaimku?gagal=user");

  const emails = await gh("/user/emails", token);
  const primary = Array.isArray(emails)
    ? (emails.find((e: { primary: boolean; verified: boolean }) => e.primary && e.verified) ??
      emails.find((e: { verified: boolean }) => e.verified))
    : null;

  await setSession({ login: user.login, avatar: user.avatar_url, email: primary?.email ?? "", token });
  if (primary?.email) saveClaimUser(user.login, primary.email);

  redirect(back.startsWith("/") ? back : "/klaimku");
}
