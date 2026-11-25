import type { ComponentProps } from 'react';

export function Card({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`rounded-lg border border-regua bg-superficie p-5 ${className}`} {...props} />;
}
