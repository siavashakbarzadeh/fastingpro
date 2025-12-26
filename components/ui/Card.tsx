import React from 'react';

interface CardProps {
    children?: React.ReactNode;
    title?: string;
    subtitle?: string;
    icon?: React.ElementType;
    variant?: 'white' | 'dark' | 'glass' | 'primary' | 'secondary' | 'accent' | 'danger';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
    footer?: React.ReactNode;
    onClick?: () => void;
}

export const Card = ({
    children,
    title,
    subtitle,
    icon: Icon,
    variant = 'white',
    padding = 'md',
    className = '',
    footer,
    onClick,
}: CardProps) => {
    const variants: Record<string, string> = {
        white: 'bg-white border border-border shadow-sm text-slate-900',
        dark: 'bg-slate-900 text-white shadow-xl shadow-slate-200',
        glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-lg',
        primary: 'bg-primary text-white shadow-xl shadow-primary/20',
        secondary: 'bg-secondary text-white shadow-xl shadow-secondary/20',
        accent: 'bg-accent text-white shadow-xl shadow-accent/20',
        danger: 'bg-danger text-white shadow-xl shadow-danger/20',
    };

    const paddings: Record<string, string> = {
        none: '',
        sm: 'p-4',
        md: 'p-6 sm:p-8',
        lg: 'p-8 sm:p-10',
    };

    return (
        <div
            onClick={onClick}
            className={`rounded-[2.5rem] overflow-hidden transition-all ${variants[variant as string]} ${className}`}
        >
            {(title || Icon) && (
                <div className={`flex items-center justify-between mb-6 px-8 pt-8`}>
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${variant === 'dark' ? 'bg-white/10 text-white' : 'bg-primary/10 text-primary'}`}>
                                <Icon size={20} />
                            </div>
                        )}
                        <div>
                            {title && <h2 className="text-xl font-black leading-tight tracking-tight">{title}</h2>}
                            {subtitle && <p className={`text-xs font-bold leading-tight ${variant === 'dark' ? 'text-slate-400' : 'text-muted'}`}>{subtitle}</p>}
                        </div>
                    </div>
                </div>
            )}

            <div className={paddings[padding]}>
                {children}
            </div>

            {footer && (
                <div className="border-t border-border mt-2 px-8 py-4 bg-slate-50/50">
                    {footer}
                </div>
            )}
        </div>
    );
};
