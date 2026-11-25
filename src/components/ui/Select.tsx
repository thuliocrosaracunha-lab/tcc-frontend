import { useId, type ComponentProps } from 'react';
import { FieldError } from './FieldError';
import { CLASSES_CAMPO } from './Input';
import { Label } from './Label';

type SelectProps = ComponentProps<'select'> & {
  label: string;
  erro?: string;
};

export function Select({ label, erro, id, className = '', children, ...props }: SelectProps) {
  const idGerado = useId();
  const idCampo = id ?? idGerado;
  const idErro = `${idCampo}-erro`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={idCampo}>{label}</Label>
      <div className="relative">
        <select
          id={idCampo}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? idErro : undefined}
          className={`${CLASSES_CAMPO} appearance-none pr-10 ${erro ? 'border-despesa' : 'border-regua-forte/70'} ${className}`}
          {...props}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-tinta-suave"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <FieldError id={idErro} mensagem={erro} />
    </div>
  );
}
