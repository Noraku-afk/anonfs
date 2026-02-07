import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] border-0',
        ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white',
        outline: 'border border-gray-700 bg-transparent hover:bg-gray-800 text-gray-300',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                className
            )}
            {...props}
        />
    );
});
Button.displayName = 'Button';

export const Input = React.forwardRef(({ className, icon: Icon, ...props }, ref) => {
    return (
        <div className="relative group">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-blue-500">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <input
                ref={ref}
                className={cn(
                    'w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200',
                    Icon && 'pl-10',
                    className
                )}
                {...props}
            />
        </div>
    );
});
Input.displayName = 'Input';

export const Card = ({ className, children }) => (
    <div className={cn('relative overflow-hidden rounded-2xl bg-[#0A0F1C]/80 border border-white/5 backdrop-blur-xl shadow-2xl', className)}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        <div className="relative z-10">{children}</div>
    </div>
);
