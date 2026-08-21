import { Mail } from "lucide-react";

export function VerifyEmailBanner({ email }: Readonly<{ email: string }>) {
  return (
    <output
      className="flex gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-3 text-xs leading-relaxed text-foreground"
    >
      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
      <p>
        Email verifikasi dikirim ke <strong>{email}</strong>. Klik link di email Anda
        untuk menerapkan perubahan. Link berlaku 10 menit.
      </p>
    </output>
  );
}
