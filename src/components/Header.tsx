"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { repoUrl } from "@/config";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/domains", label: "Daftar domain" },
  { href: "/check", label: "Cek nama" },
  { href: "/daftar", label: "Cara klaim" },
  { href: "/email", label: "Email" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="wrap-wide inner">
        <Link href="/" className="brand">
          sang<span className="zone">.ceo</span>
        </Link>
        <nav className="site-nav" aria-label="Navigasi utama">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
          <a href={repoUrl()} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
