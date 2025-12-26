"use client";
import React from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/dashboard', label: 'Dashboard', icon: '📚' },
  { href: '/fasting', label: 'Fasting', icon: '⏱️' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-sm flex justify-around items-center h-16 md:hidden">
      {navItems.map(({ href, label, icon }) => {
        const active = pathname === href;
        return (
          <a
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 text-xs font-bold transition-colors ${active ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className="text-lg leading-none">{icon}</span>
            <span className="text-[11px]">{label}</span>
          </a>
        );
      })}
    </nav>
  );
}
