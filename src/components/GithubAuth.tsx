"use client";

import { useEffect, useState } from "react";

type Me = { login: string; avatar: string } | null;

export default function GithubAuth() {
  const [me, setMe] = useState<Me>(undefined as unknown as Me);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d.login ? d : null))
      .catch(() => setMe(null));
  }, []);

  if (me === undefined) return null;

  if (!me) {
    return (
      <a className="btn text-xs py-1.5 px-3" href="/api/auth/github?back=/klaimku">
        Masuk dengan GitHub
      </a>
    );
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        className="btn text-xs py-1.5 px-3 flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={me.avatar} alt="" width={18} height={18} className="rounded-full" />
        <span className="mono">{me.login}</span>
      </button>
      {open && (
        <div className="menu" role="menu">
          <a role="menuitem" href="/klaimku" onClick={() => setOpen(false)}>
            Klaimku
          </a>
          <a role="menuitem" href="/api/auth/logout">
            Keluar
          </a>
        </div>
      )}
    </span>
  );
}
