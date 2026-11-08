import { headers } from "next/headers";

// Origin publik situs, di belakang proxy nginx + Cloudflare.
export async function siteOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "sang.ceo";
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}
