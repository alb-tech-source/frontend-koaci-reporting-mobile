import { Bell } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

interface BerandaHeaderProps {
  investorName: string;
  unreadNotifications?: number;
  onNotificationClick?: () => void;
}

export function BerandaHeader({
  investorName,
  unreadNotifications = 0,
  onNotificationClick,
}: Readonly<BerandaHeaderProps>) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">Selamat datang,</p>
        <p className="truncate text-base font-semibold text-foreground">
          {investorName}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onNotificationClick}
        aria-label={
          unreadNotifications > 0
            ? `Notifikasi (${unreadNotifications} belum dibaca)`
            : "Notifikasi"
        }
        className="relative rounded-full"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadNotifications > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
            {unreadNotifications > 9 ? "9+" : unreadNotifications}
          </span>
        ) : null}
      </Button>
    </div>
  );
}
