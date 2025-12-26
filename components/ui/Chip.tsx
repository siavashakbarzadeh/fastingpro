import React from 'react';

interface ChipProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'slate';
    icon?: React.ElementType;
}

export const Chip: React.FC<ChipProps> = ({
    label,
    active,
    onClick,
    variant = 'primary',
    icon: Icon,
}) => {
    const variants = {
        primary: {
            active: 'bg-primary text-white shadow-lg shadow-primary/20',
            inactive: 'bg-primary/5 text-primary hover:bg-primary/10 border border-primary/10'
        },
        secondary: {
            active: 'bg-secondary text-white shadow-lg shadow-secondary/20',
            inactive: 'bg-secondary/5 text-secondary hover:bg-secondary/10 border border-secondary/10'
        },
        accent: {
            active: 'bg-accent text-white shadow-lg shadow-accent/20',
            inactive: 'bg-accent/5 text-accent hover:bg-accent/10 border border-accent/10'
        },
        danger: {
            active: 'bg-danger text-white shadow-lg shadow-danger/20',
            inactive: 'bg-danger/5 text-danger hover:bg-danger/10 border border-danger/10'
        },
        slate: {
            active: 'bg-slate-900 text-white shadow-lg shadow-slate-200',
            inactive: 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
        },
    };

    const currentVariant = variants[variant];

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${active ? currentVariant.active : currentVariant.inactive
                }`}
        >
            {Icon && <Icon size={12} />}
            {label}
        </button>
    );
};
