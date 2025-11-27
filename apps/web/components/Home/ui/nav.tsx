"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const route = useRouter();

  const path = route.prefetch;

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-neutral-200/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          ConsensusFlow
        </Link>

        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                `text-gray-700 hover:text-gray-400 transition-colors text-sm`,
                path.toString() === link.href && "text-primary font-semibold"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex gap-3">
          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg border border-border hover:border-foreground text-neutral-950 hover:text-gray-500 text-sm transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm transition-colors"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-foreground/95 backdrop-blur">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block text-gray-950 hover:text-foreground transition-colors"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-border">
              <Link
                href="/contact"
                className="block px-4 py-2 rounded-lg border border-border text-center  hover:border-foreground text-neutral-950 hover:text-gray-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/auth/login"
                className="block px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-center transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
