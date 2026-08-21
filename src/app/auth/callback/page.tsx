"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/authStore";
import api from "@/shared/lib/axios";

const CallbackGoogleLogin = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const fetchProfileAndRedirect = async () => {
      try {
        const { data } = await api.get("/auth/me"); 

        if (data?.data) {

          setAuth(data.data);

          document.cookie = `user_role=${data.data.role}; path=/; max-age=86400`;

          if (data.data.role === "investor") {
            router.push("/investor/beranda");
          } else {
            router.push("/user/beranda");
          }
        } else {
          throw new Error("Gagal mengambil profil.");
        }
      } catch (error) {
        console.error("Callback OAuth gagal", error);
        router.push("/");
      }
    };

    fetchProfileAndRedirect();
  }, [router, setAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">Memproses login Google...</p>
    </div>
  );
};

const CallbackPage = () => (
  <Suspense fallback={<div>Memuat...</div>}>
    <CallbackGoogleLogin />
  </Suspense>
);

export default CallbackPage;