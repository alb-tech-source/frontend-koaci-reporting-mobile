import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export interface RegisterFormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface RegisterFormProps {
  loading?: boolean;
  onSubmit?: (values: RegisterFormValues) => void;
}

export function RegisterForm({ loading, onSubmit }: Readonly<RegisterFormProps>) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setLocalError("Password minimal 8 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Konfirmasi password tidak sama.");
      return;
    }
    setLocalError("");
    onSubmit?.({ firstname, lastname, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="register-firstname">Nama Depan</Label>
          <Input
            id="register-firstname"
            autoComplete="given-name"
            placeholder="Ahmad"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-lastname">Nama Belakang</Label>
          <Input
            id="register-lastname"
            autoComplete="family-name"
            placeholder="Opsional"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-confirm-password">Konfirmasi Password</Label>
        <Input
          id="register-confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {localError ? (
        <p className="text-sm font-medium text-destructive">{localError}</p>
      ) : null}

      <Button type="submit" variant="primary" size="touch" className="w-full" disabled={loading}>
        {loading ? "Memproses..." : "Daftar"}
      </Button>
    </form>
  );
}