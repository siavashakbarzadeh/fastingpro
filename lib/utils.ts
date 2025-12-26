import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// --- Validation Helpers ---
export const validate = {
    isPositiveNumber: (val: any) => !isNaN(val) && parseFloat(val) > 0,
    isNotEmpty: (val: string) => val.trim().length > 0,
    isValidEmail: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
};
