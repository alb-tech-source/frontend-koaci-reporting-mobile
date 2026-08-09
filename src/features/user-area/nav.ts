import { Compass, Home, User } from "lucide-react";

import type { BottomNavItem } from "@/components/layout/BottomNav";

export const userNav: BottomNavItem[] = [
  { to: "/user/beranda", label: "Beranda", icon: Home },
  { to: "/user/jelajahi", label: "Jelajahi", icon: Compass },
  { to: "/user/akun", label: "Akun", icon: User },
];