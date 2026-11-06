import type { ComponentProps } from 'react';

export function Card({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`rounded-lg border border-slate-300 bg-white p-4 ${className}`} {...props} />;
}
