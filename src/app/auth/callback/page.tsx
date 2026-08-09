"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/features/auth/InvestorAuthCard";

const CallbackGoogleLogin = () => {
  const [accessToken, setAccessToken] = useState<string | null>("");
  const [refreshToken, setRefreshToken] = useState<string | null>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleLogin = () => {
    try {
      document.cookie = `access_token=${accessToken}; path=/; max-age=86400`;
      localStorage.setItem("access_token", accessToken as string);
      localStorage.setItem("refresh_token", refreshToken as string);

      const decodedToken = jwtDecode<JwtPayload>(accessToken as string);

      // Redirect dinamis berdasarkan role
      if (decodedToken.role === "investor") {
        router.push("/investor/portofolio");
      } else {
        router.push("/user/beranda");
      }
    } catch (err) {
      router.push("/");
    }
  };

  // Get token
  useEffect(() => {
    if (searchParams) {
      const token = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");

      setAccessToken(token);
      setRefreshToken(refreshToken);
    }
  }, [searchParams]);

  // Redirect and save token
  useEffect(() => {
    if (accessToken && refreshToken) {
      handleLogin();
    }
  }, [accessToken]);
  return <div></div>;
};

export default CallbackGoogleLogin;
