interface FieldRowProps {
  label: string;
  value?: string | null;
}

export function FieldRow({ label, value }: Readonly<FieldRowProps>) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/70 py-2.5 last:border-b-0">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">
        {value && value.trim() !== "" ? value : "-"}
      </span>
    </div>
  );
}
