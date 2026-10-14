"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, BookUser, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Início", icon: Home },
  { href: "/contas", label: "Contas", icon: ListChecks },
  { href: "/relatorio", label: "Relatório", icon: FileText },
  { href: "/cadastros", label: "Cadastros", icon: BookUser },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-teal-100 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 min-h-14 text-xs font-semibold",
                active ? "text-teal-800" : "text-stone-400"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-12 items-center justify-center rounded-full",
                  active && "bg-teal-100"
                )}
              >
                <Icon className={cn("h-6 w-6", active && "stroke-[2.5]")} />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
