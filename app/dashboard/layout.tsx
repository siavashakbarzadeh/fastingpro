'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Timer, ClipboardList, GraduationCap, ChefHat, User } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-emerald-100">
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
