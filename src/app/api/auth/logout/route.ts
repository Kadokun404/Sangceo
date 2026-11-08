import { redirect } from "next/navigation";
import { clearSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  await clearSession();
  redirect("/");
}
