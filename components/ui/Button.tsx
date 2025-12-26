import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    icon,
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none gap-2';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-600 shadow-lg shadow-primary/20',
        secondary: 'bg-secondary text-white hover:bg-secondary-600 shadow-lg shadow-secondary/20',
        ghost: 'bg-transparent text-muted hover:bg-slate-100',
        danger: 'bg-danger text-white hover:bg-danger/90 shadow-lg shadow-danger/20',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    {icon && <span className="shrink-0">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};
