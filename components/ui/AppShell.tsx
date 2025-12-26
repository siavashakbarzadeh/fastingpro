import React from 'react';
import Link from 'next/link';
import {
    Timer,
    Calendar,
    BookOpen,
    Utensils,
    User,
    Bell,
    ArrowLeft
} from 'lucide-react';

interface AppShellProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    showBackButton?: boolean;
    backUrl?: string;
    hideTopBar?: boolean;
    hideBottomNav?: boolean;
    activeTab?: 'fasting' | 'plan' | 'learn' | 'recipes' | 'me';
}

export const AppShell: React.FC<AppShellProps> = ({
    children,
    title = 'GoHealthing',
    subtitle,
    showBackButton,
    backUrl = '/',
    hideTopBar,
    hideBottomNav,
    activeTab,
}) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center">
            {/* Desktop Wrapper Centering */}
            <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-slate-100">

                {/* Top App Bar */}
                {!hideTopBar && (
                    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {showBackButton ? (
                                <Link href={backUrl} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-primary transition-colors">
                                    <ArrowLeft size={18} />
                                </Link>
                            ) : (
                                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xs">GH</div>
                            )}
                            <div>
                                <h1 className="text-sm font-black tracking-tight text-slate-900 leading-tight">{title}</h1>
                                {subtitle && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 bg-slate-50 rounded-full text-slate-400">
                                <Bell size={18} />
                            </button>
                            <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=User&background=14b8a6&color=fff" alt="Profile" className="w-full h-full object-cover" />
                            </Link>
                        </div>
                    </header>
                )}

                {/* Main Content */}
                <main className={`flex-1 overflow-y-auto no-scrollbar pb-24 ${hideTopBar ? '' : 'pt-2'}`}>
                    {children}
                </main>

                {/* Bottom Navigation */}
                {!hideBottomNav && (
                    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-border px-6 pt-3 pb-8 flex items-center justify-between z-30">
                        <NavItem href="/fasting" icon={Timer} label="Fasting" active={activeTab === 'fasting'} />
                        <NavItem href="/dashboard/plans" icon={Calendar} label="Plan" active={activeTab === 'plan'} />
                        <NavItem href="/dashboard/learn" icon={BookOpen} label="Learn" active={activeTab === 'learn'} />
                        <NavItem href="/dashboard/recipes" icon={Utensils} label="Recipes" active={activeTab === 'recipes'} />
                        <NavItem href="/dashboard/profile" icon={User} label="Me" active={activeTab === 'me'} />
                    </nav>
                )}

            </div>
        </div>
    );
};

function NavItem({ href, icon: Icon, label, active = false }: { href: string; icon: React.ElementType; label: string; active?: boolean }) {
    return (
        <Link href={href} className="flex flex-col items-center gap-1.5 group">
            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${active ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'text-slate-300 group-hover:text-primary/60'}`}>
                <Icon size={20} fill={active ? "currentColor" : "none"} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'text-primary' : 'text-slate-400'}`}>
                {label}
            </span>
        </Link>
    );
}
