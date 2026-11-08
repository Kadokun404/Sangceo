import { headers } from "next/headers";
import fs from "node:fs";
import path from "node:path";
import { getSession } from "@/lib/auth";
import { SITE } from "@/config";

export const dynamic = "force-dynamic";

const NAME_RE = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?$/;

function gh(pathname: string, token: string, init?: RequestInit) {
  return fetch(`https://api.github.com${pathname}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "sang-ceo-registry",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });
}

function sudahKlaim(kind: "subdomain" | "mailbox", nama: string): boolean {
  const dir = kind === "subdomain" ? "data/domains" : "data/emails";
  try {
    return fs.readdirSync(path.join(process.cwd(), dir)).some((f) => {
      const raw = fs.readFileSync(path.join(process.cwd(), dir, f), "utf8");
      const json = JSON.parse(raw) as { address?: string; subdomain?: string };
      return kind === "mailbox" ? json.address === nama : json.subdomain === nama;
    });
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "harus login dengan GitHub" }, { status: 401 });

  const origin = `https://${(await headers()).get("x-forwarded-host") || "sang.ceo"}`;
  const requestOrigin = (await headers()).get("origin");
  if (requestOrigin && requestOrigin !== origin) {
    return Response.json({ error: "origin tidak cocok" }, { status: 403 });
  }

  const body = (await req.json()) as { kind?: string; address?: string; subdomain?: string; cname?: string };
  let filepath: string;
  let content: string;
  let title: string;

  if (body.kind === "mailbox") {
    const address = (body.address || "").trim().toLowerCase();
    if (!NAME_RE.test(address)) return Response.json({ error: "alamat tidak valid" }, { status: 400 });
    if (sudahKlaim("mailbox", address))
      return Response.json({ error: `alamat ${address}@sang.ceo sudah diklaim` }, { status: 409 });
    content = JSON.stringify(
      { domain: SITE.zone, address, type: "mailbox", owner: session.login },
      null,
      2
    );
    filepath = `data/emails/${address}.json`;
    title = `klaim ${address}@${SITE.zone}`;
  } else if (body.kind === "subdomain") {
    const sub = (body.subdomain || "").trim().toLowerCase();
    if (!NAME_RE.test(sub)) return Response.json({ error: "subdomain tidak valid" }, { status: 400 });
    if (sudahKlaim("subdomain", sub))
      return Response.json({ error: `subdomain ${sub} sudah diklaim` }, { status: 409 });
    const cname = (body.cname || "").trim() || "cname.vercel-dns.com";
    content = JSON.stringify(
      { domain: SITE.zone, subdomain: sub, owner: session.login, records: { CNAME: cname } },
      null,
      2
    );
    filepath = `data/domains/${sub}.${SITE.zone}.json`;
    title = `klaim ${sub}.${SITE.zone}`;
  } else {
    return Response.json({ error: "jenis klaim tidak dikenal" }, { status: 400 });
  }

  const token = session.token;

  // Fork repo (idempoten: kalau sudah ada, GitHub balas dengan fork lama).
  const forkRes = await gh(`/repos/${SITE.repo}/forks`, token, {
    method: "POST",
    body: JSON.stringify({ default_branch_only: true }),
  });
  const fork = (await forkRes.json()) as { full_name?: string; default_branch?: string; message?: string };
  if (!fork.full_name) return Response.json({ error: fork.message || "gagal fork" }, { status: 500 });
  const forkName = fork.full_name;
  const baseBranch = fork.default_branch || "main";

  // Branch klaim unik per percobaan.
  const branch = `klaim/${filepath.split("/").pop()?.replace(".json", "")}-${Date.now().toString(36)}`;
  const refRes = await gh(`/repos/${forkName}/git/ref/heads/${baseBranch}`, token);
  const ref = (await refRes.json()) as { object?: { sha?: string }; message?: string };
  if (!ref.object?.sha) return Response.json({ error: ref.message || "fork belum siap" }, { status: 503 });

  const branchRes = await gh(`/repos/${forkName}/git/refs`, token, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: ref.object.sha }),
  });
  if (!branchRes.ok) {
    const err = (await branchRes.json()) as { message?: string };
    return Response.json({ error: err.message || "gagal membuat branch" }, { status: 500 });
  }

  // Tunggu fork siap sebelum commit (GitHub butuh beberapa detik untuk fork baru).
  let commitOk = false;
  let commitErr = "";
  for (let i = 0; i < 5; i++) {
    const put = await gh(`/repos/${forkName}/contents/${filepath}`, token, {
      method: "PUT",
      body: JSON.stringify({
        message: `klaim ${path.basename(filepath)}`,
        content: Buffer.from(content).toString("base64"),
        branch,
      }),
    });
    if (put.ok) {
      commitOk = true;
      break;
    }
    commitErr = ((await put.json()) as { message?: string }).message || "gagal commit";
    await new Promise((r) => setTimeout(r, 1500));
  }
  if (!commitOk) return Response.json({ error: commitErr }, { status: 500 });

  const prRes = await gh(`/repos/${SITE.repo}/pulls`, token, {
    method: "POST",
    body: JSON.stringify({
      title,
      head: `${session.login}:${branch}`,
      base: "main",
      body: "Klaim dibuat lewat https://sang.ceo dengan login GitHub.",
    }),
  });
  const pr = (await prRes.json()) as { html_url?: string; message?: string };
  if (!pr.html_url) return Response.json({ error: pr.message || "gagal membuat PR" }, { status: 500 });

  return Response.json({ pr: pr.html_url });
}
