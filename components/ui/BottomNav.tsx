"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Timer, Home, User, BookOpen } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: BookOpen },
  { href: "/fasting", label: "Fasting", icon: Timer },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-sm flex justify-around items-center h-16 md:hidden">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors ${active ? "text-primary" : "text-slate-400"}`}
          >
            <Icon size={22} className="mb-0.5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
