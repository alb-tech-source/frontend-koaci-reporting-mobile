"use client"; 

import { Button } from "@/shared/components/ui/button";
import { logout } from "@/shared/lib/auth";


export default function AkunPage() {
  return (
    <div className="p-4 max-w-sm mx-auto"> {/* Wrapper opsional, sesuaikan dengan desain Anda */}
      <Button 
        variant="destructive" 
        className="w-full" 
        onClick={() => logout("/")}
      >
        Keluar
      </Button>
    </div>
  );
}