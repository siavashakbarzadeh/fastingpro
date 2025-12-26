"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Fasting", href: "/fasting", icon: "⏳" },
  { name: "Learn", href: "/learn", icon: "📚" },
  { name: "History", href: "/dashboard/history", icon: "📊" },
  { name: "Profile", href: "/me", icon: "👤" },
];

const TabsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <main className="flex-grow max-w-md mx-auto px-4 py-4 space-y-6">{children}</main>
      <nav className="bg-white border-t shadow-sm">
        <div className="max-w-md mx-auto flex justify-around py-2">
          {tabs.map((tab) => (
            <Link key={tab.name} href={tab.href} className="flex flex-col items-center">
              <span
                className={`text-xl ${
                  pathname === tab.href ? "text-blue-500" : "text-gray-500"
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-xs ${
                  pathname === tab.href ? "text-blue-500" : "text-gray-500"
                }`}
              >
                {tab.name}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default TabsLayout;