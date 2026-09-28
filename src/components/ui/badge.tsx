import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

const badgeVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'border-transparent bg-zinc-900 text-zinc-50 shadow-xs hover:bg-zinc-800',
  secondary: 'border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
  destructive: 'border-transparent bg-red-500 text-white shadow-xs hover:bg-red-600',
  outline: 'border-zinc-200 text-zinc-950',
  success: 'border-transparent bg-emerald-50 text-emerald-700 border border-emerald-200',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}
