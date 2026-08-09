export interface CurrentUser {
  name: string;
  email: string;
  role: "user" | "investor";
  verified: boolean;
}

/**
 * Stub — ganti dengan pembacaan sesi/JWT Anda.
 * Nilainya sengaja deterministik agar aman untuk SSR.
 */
export function getCurrentUser(): CurrentUser {
  return {
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@email.com",
    role: "user",
    verified: false,
  };
}

/** Stub — sambungkan ke logic logout Anda. */
export function logout(p0: string): void {
  console.info("[auth] logout");
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export const WHATSAPP_CS_URL = "https://wa.me/6281234567890";
export const SUPPORT_EMAIL = "admin@koaci.id";