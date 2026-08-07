import { GoogleIcon } from "./GoogleIcon";

interface GoogleAuthButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function GoogleAuthButton({ label, disabled, onClick }: Readonly<GoogleAuthButtonProps>) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
    >
      <GoogleIcon className="h-5 w-5" />
      {label}
    </button>
  );
}

export function AuthDivider({ label = "atau" }: Readonly<{ label?: string }>) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}