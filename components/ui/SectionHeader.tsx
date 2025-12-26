import React from 'react';

interface SectionHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    description,
    action,
}) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-xs font-black uppercase text-muted tracking-widest">{title}</h3>
                {description && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{description}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
};
