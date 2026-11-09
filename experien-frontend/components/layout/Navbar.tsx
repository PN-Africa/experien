"use client";

import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const links = [
  { label: "Industries", href: "/industries" },
  { label: "Courses", href: "/courses" },
  { label: "How it works", href: "/#how-it-works" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, status, logout } = useAuth();
  const close = () => setOpen(false);

  return (
    <header className="border-b border-line bg-white">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3 md:grid md:grid-cols-[1fr_auto_1fr] md:px-16">
        {/* Logo */}
        <Link href="/" onClick={close} className="flex items-center">
          <img src="/logo.png" alt="Experien" className="h-9 w-auto md:h-11" />
        </Link>


        {/* Desktop links (centre) */}
        <div className="hidden items-center gap-10 text-sm font-medium text-ink md:flex">
          {links.map((l) => (
            <Link key={l.label} href={l.href} className="hover:opacity-70">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions (right) */}
        <div className="hidden items-center justify-end gap-6 text-sm font-medium text-ink md:flex">
          {status === "loading" ? (
            <div className="h-9 w-40" aria-hidden />
          ) : user ? (
            <>
              <Link href="/dashboard" className="hover:opacity-70">My learning</Link>
              <button
                type="button"
                onClick={() => logout()}
                className="rounded-lg bg-lime px-4 py-2 hover:brightness-95"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:opacity-70">Log in</Link>
              <Link href="/register" className="rounded-lg bg-lime px-4 py-2 hover:brightness-95">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="rounded-md p-2 text-ink md:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-line bg-white px-6 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-4 text-sm font-medium text-ink">
            {links.map((l) => (
              <Link key={l.label} href={l.href} onClick={close}>
                {l.label}
              </Link>
            ))}
            {status === "loading" ? null : user ? (
              <>
                <Link href="/dashboard" onClick={close}>My learning</Link>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    logout();
                  }}
                  className="rounded-lg bg-lime px-4 py-2 text-center"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={close}>Log in</Link>
                <Link
                  href="/register"
                  onClick={close}
                  className="rounded-lg bg-lime px-4 py-2 text-center"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}