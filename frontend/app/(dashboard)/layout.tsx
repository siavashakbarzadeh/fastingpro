'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Clock, User } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', icon: Clock, label: 'Timer' },
        { href: '/dashboard/plans', icon: Calendar, label: 'Plans' },
        { href: '/dashboard/history', icon: Home, label: 'History' },
        { href: '/dashboard/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
            <main className="flex-1 overflow-y-auto pb-20 p-6">
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-950/90 backdrop-blur-lg safe-bottom">
                <div className="flex justify-around items-center p-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center p-2 rounded-xl transition-colors ${isActive ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                <item.icon size={24} />
                                <span className="text-xs mt-1 font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
