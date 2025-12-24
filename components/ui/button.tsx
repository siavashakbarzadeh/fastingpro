import * as React from "react"
import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
    size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        'bg-orange-600 text-white hover:bg-orange-500 shadow-lg shadow-orange-900/20': variant === 'default',
                        'border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100': variant === 'outline',
                        'hover:bg-slate-800 text-slate-100': variant === 'ghost',
                        'bg-red-600 text-white hover:bg-red-500': variant === 'destructive',
                        'h-11 px-6 py-2': size === 'default',
                        'h-9 px-3': size === 'sm',
                        'h-14 px-8 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
