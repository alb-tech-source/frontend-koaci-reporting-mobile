"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import type { ListFilter } from "@/shared/lib/list-filter";

interface SearchFilterBarProps {
  value: ListFilter;
  onChange: (next: ListFilter) => void;
  projects: string[];
  title: string;
  className?: string;
}

export function SearchFilterBar({
  value,
  onChange,
  projects,
  title,
  className,
}: Readonly<SearchFilterBarProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const set = (patch: Partial<ListFilter>) => onChange({ ...value, ...patch });
  const hasActiveFilter = Boolean(
    value.project || value.dateStart || value.dateEnd,
  );

  const reset = () => {
    set({ project: "", dateStart: "", dateEnd: "" });
    setIsOpen(false);
  };

  return (
    <>
      <div className={cn("flex gap-2", className)}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari proyek atau PT..."
            value={value.search}
            onChange={(e) => set({ search: e.target.value })}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
        <Button
          variant={hasActiveFilter ? "primary" : "outline"}
          size="icon"
          aria-label="Buka filter"
          onClick={() => setIsOpen(true)}
          className="h-10 w-10 shrink-0 rounded-xl"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="pb-safe">
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="project-filter" className="text-sm font-medium">
                Pilih Proyek
              </label>
              <select
                id="project-filter"
                value={value.project}
                onChange={(e) => set({ project: e.target.value })}
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Semua Proyek</option>
                {projects.map((proj) => (
                  <option key={proj} value={proj}>
                    {proj}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="date-start" className="text-sm font-medium">
                  Dari Tanggal
                </label>
                <Input
                  id="date-start"
                  type="date"
                  value={value.dateStart}
                  onChange={(e) => set({ dateStart: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="date-end" className="text-sm font-medium">
                  Sampai Tanggal
                </label>
                <Input
                  id="date-end"
                  type="date"
                  value={value.dateEnd}
                  onChange={(e) => set({ dateEnd: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
          <DrawerFooter className="flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={reset}>
              Reset
            </Button>
            <Button className="flex-1" onClick={() => setIsOpen(false)}>
              Terapkan
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
