type FieldErrorProps = {
  /** Referenciado pelo aria-describedby do campo. */
  id: string;
  mensagem?: string;
};

export function FieldError({ id, mensagem }: FieldErrorProps) {
  if (!mensagem) return null;

  return (
    <p id={id} className="flex items-start gap-1.5 text-[13px] text-despesa">
      <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 size-3.5 shrink-0" fill="currentColor">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 3.5h1.5v4.75h-1.5V4.5Zm0 6h1.5V12h-1.5v-1.5Z" />
      </svg>
      {mensagem}
    </p>
  );
}
