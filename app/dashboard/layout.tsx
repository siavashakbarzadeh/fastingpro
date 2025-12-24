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

    const navItems = [
        { href: '/dashboard', icon: Timer, label: 'Fasting' },
        { href: '/dashboard/plans', icon: ClipboardList, label: 'Plan' },
        { href: '/dashboard/learn', icon: GraduationCap, label: 'Learn' },
        { href: '/dashboard/recipes', icon: ChefHat, label: 'Recipes' },
        { href: '/dashboard/profile', icon: User, label: 'Me' },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-emerald-100">
            <main className="flex-1 overflow-y-auto pb-24">
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-100 bg-white/95 backdrop-blur-lg safe-bottom z-50">
                <div className="flex justify-around items-center p-2 max-w-md mx-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${isActive
                                    ? 'text-[#00ca86] scale-110'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[10px] mt-1 font-bold uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
