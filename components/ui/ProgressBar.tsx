import React from 'react';

interface ProgressBarProps {
    progress: number; // 0 to 100
    color?: 'primary' | 'secondary' | 'accent' | 'danger';
    height?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    label?: string;
    variant?: 'glow' | 'flat';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    color = 'primary',
    height = 'md',
    showLabel,
    label,
    variant = 'glow',
}) => {
    const safeProgress = Math.min(Math.max(progress, 0), 100);

    const colors = {
        primary: 'bg-primary shadow-primary/20',
        secondary: 'bg-secondary shadow-secondary/20',
        accent: 'bg-accent shadow-accent/20',
        danger: 'bg-danger shadow-danger/20',
    };

    const heights = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-4',
    };

    return (
        <div className="w-full space-y-2">
            {(showLabel || label) && (
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                    <span>{label}</span>
                    {showLabel && <span>{Math.round(safeProgress)}%</span>}
                </div>
            )}
            <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heights[height]}`}>
                <div
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${colors[color]} ${variant === 'glow' ? 'shadow-[0_0_15px_-3px_rgba(0,0,0,0.1)]' : ''}`}
                    style={{ width: `${safeProgress}%` }}
                />
            </div>
        </div>
    );
};
