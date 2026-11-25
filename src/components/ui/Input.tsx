import { useId, type ComponentProps } from 'react';
import { FieldError } from './FieldError';
import { Label } from './Label';

type InputProps = ComponentProps<'input'> & {
  label: string;
  erro?: string;
};

export const CLASSES_CAMPO =
  'min-h-11 w-full rounded-md border bg-superficie px-3 py-2 text-base text-tinta ' +
  'placeholder:text-tinta-suave/60 transition-[border-color,box-shadow] duration-150 ' +
  'hover:border-tinta/55 focus-visible:border-pinho';

export function Input({ label, erro, id, className = '', ...props }: InputProps) {
  const idGerado = useId();
  const idCampo = id ?? idGerado;
  const idErro = `${idCampo}-erro`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={idCampo}>{label}</Label>
      <input
        id={idCampo}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={`${CLASSES_CAMPO} ${erro ? 'border-despesa' : 'border-regua-forte/70'} ${className}`}
        {...props}
      />
      <FieldError id={idErro} mensagem={erro} />
    </div>
  );
}
