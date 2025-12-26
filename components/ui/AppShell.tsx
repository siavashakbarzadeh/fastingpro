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
                            <Link href="/me" className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                                <img src="https://ui-avatars.com/api/?name=User&background=14b8a6&color=fff" alt="Profile" className="w-full h-full object-cover" />
                            </Link>
                        </div>
                    </header>
                )}

                {/* Main Content */}
                <main className={`flex-1 overflow-y-auto no-scrollbar ${hideTopBar ? 'pb-4' : 'pt-2 pb-24'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

