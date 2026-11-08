import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSession();
  if (!s) return Response.json({ login: null });
  return Response.json({ login: s.login, avatar: s.avatar });
}
