type FieldErrorProps = {
  /** Referenciado pelo aria-describedby do campo. */
  id: string;
  mensagem?: string;
};

export function FieldError({ id, mensagem }: FieldErrorProps) {
  if (!mensagem) return null;

  return (
    <p id={id} className="text-sm text-red-700">
      {mensagem}
    </p>
  );
}
