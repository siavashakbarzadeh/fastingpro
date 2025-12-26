import React from 'react';
import { Loader2, Inbox, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading your health data...' }) => (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{message}</p>
    </div>
);

export const EmptyState: React.FC<{
    message: string;
    description?: string;
    action?: { label: string; onClick: () => void };
}> = ({ message, description, action }) => (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
            <Inbox className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-base font-black text-slate-800 mb-2">{message}</h3>
        {description && <p className="text-xs font-bold text-slate-400 max-w-[200px] mb-6">{description}</p>}
        {action && (
            <Button variant="primary" size="sm" onClick={action.onClick}>
                {action.label}
            </Button>
        )}
    </div>
);

export const ErrorState: React.FC<{
    message?: string;
    onRetry?: () => void;
}> = ({ message = 'Something went wrong', onRetry }) => (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-danger/5 rounded-[2.5rem] border border-danger/10 animate-in fade-in duration-300">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4 text-danger">
            <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-slate-800 mb-2">{message}</h3>
        <p className="text-xs font-bold text-danger/60 mb-6">Please try again or contact support if the issue persists.</p>
        {onRetry && (
            <Button variant="danger" size="sm" onClick={onRetry} icon={<RefreshCcw size={14} />}>
                Retry
            </Button>
        )}
    </div>
);
