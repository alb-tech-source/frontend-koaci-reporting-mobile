"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

import { AuthDivider, GoogleAuthButton } from "./GoogleAuthButton";
import { LoginForm, type LoginFormValues } from "./LoginForm";
import { RegisterForm, type RegisterFormValues } from "./RegisterForm";

import {
  login,
  registerWithEmail,
  fetchCurrentUser,
} from "@/features/auth/api";
import { useAuthStore } from "@/shared/store/authStore";

type AuthTab = "login" | "register";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const tabs: { key: AuthTab; label: string }[] = [
  { key: "login", label: "Masuk" },
  { key: "register", label: "Daftar" },
];

export function InvestorAuthCard() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [tab, setTab] = useState<AuthTab>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formKey, setFormKey] = useState(0);

  const switchTab = (next: AuthTab) => {
    setTab(next);
    setError("");
    setSuccess("");
  };

  const handleLogin = async (values: LoginFormValues) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const loginResponse = await login(values);

      if (!loginResponse?.success) {
        throw new Error("Gagal login dari server.");
      }

      const profileResponse = await fetchCurrentUser();

      if (profileResponse?.success && profileResponse.data) {
        const activeRole = profileResponse?.data.user.role.role_name || "user";
        console.log("Active Role:", activeRole);

        setAuth({ ...profileResponse.data.user, role: activeRole });

        document.cookie = `user_role=${activeRole}; path=/; max-age=86400; SameSite=Lax`;

        if (activeRole === "investor") router.push("/investor/beranda");
        else router.push("/user/beranda");
      } else {
        throw new Error("Gagal membaca profil pengguna.");
      }
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 401) {
        setError("Email atau password salah.");
      } else {
        setError(err?.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Logika Register Email
  const handleRegister = async (values: RegisterFormValues) => {
    setError("");
    setLoading(true);
    try {
      await registerWithEmail({
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password,
      });

      setSuccess("Pendaftaran berhasil! Silakan login.");
      setFormKey((k) => k + 1);
      setTab("login");
    } catch {
      setError("Gagal mendaftar. Email mungkin sudah terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      window.location.href = `${BASE_URL}/auth/google`;
    } catch (err) {
      setError("Login Google gagal. Pastikan email Anda terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">
          {tab === "login" ? "Selamat datang kembali" : "Buat akun investor"}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="mb-5 flex border-b border-border" role="tablist">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => switchTab(key)}
            className={`-mb-px flex-1 border-b-2 pb-2.5 text-sm font-medium transition-colors ${
              tab === key
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {success && (
        <p className="mb-4 rounded-xl bg-success/10 px-3 py-2 text-sm font-medium text-success">
          {success}
        </p>
      )}
      {error && (
        <p className="mb-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      {tab === "login" ? (
        <div className="space-y-4">
          <LoginForm
            key={`login-${formKey}`}
            variant="investor"
            loading={loading}
            onSubmit={handleLogin}
            forgotPasswordHref="/auth/lupa-password"
          />
          <AuthDivider />
          <GoogleAuthButton
            label="Masuk dengan Google"
            disabled={loading}
            onClick={() => handleGoogleAuth()}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <RegisterForm
            key={`register-${formKey}`}
            loading={loading}
            onSubmit={handleRegister}
          />
          <AuthDivider />
          <GoogleAuthButton
            label="Daftar dengan Google"
            disabled={loading}
            onClick={() => handleGoogleAuth()}
          />
          <p className="rounded-xl bg-muted px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            Dengan mendaftar, akun Anda akan mendapatkan akses terbatas. Admin
            akan memverifikasi dan mengaktifkan akses investor Anda.
          </p>
        </div>
      )}
    </div>
  );
}
