import type { ComponentProps } from 'react';

export function Label({ className = '', ...props }: ComponentProps<'label'>) {
  return <label className={`text-[13px] font-medium text-tinta ${className}`} {...props} />;
}
