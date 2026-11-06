import { useId, type ComponentProps } from 'react';
import { FieldError } from './FieldError';
import { Label } from './Label';

type InputProps = ComponentProps<'input'> & {
  label: string;
  erro?: string;
};

export function Input({ label, erro, id, className = '', ...props }: InputProps) {
  const idGerado = useId();
  const idCampo = id ?? idGerado;
  const idErro = `${idCampo}-erro`;

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={idCampo}>{label}</Label>
      <input
        id={idCampo}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={`min-h-10 w-full rounded-md border bg-white px-3 py-2 text-base ${
          erro ? 'border-red-700' : 'border-slate-500'
        } ${className}`}
        {...props}
      />
      <FieldError id={idErro} mensagem={erro} />
    </div>
  );
}
