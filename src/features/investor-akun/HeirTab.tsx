import { useState, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, UserRoundPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { getErrorMessage } from "@/shared/lib/axios";

import { saveInvestorHeir } from "./api";
import { FieldRow } from "./FieldRow";
import {
  emptyHeir,
  heirRelationLabel,
  type HeirRelationValue,
  type InvestorHeir,
  type InvestorProfile,
} from "./types";
import { INDONESIAN_BANKS } from "./utils";

interface HeirTabProps {
  profile: InvestorProfile;
}

export function HeirTab({ profile }: Readonly<HeirTabProps>) {
  const queryClient = useQueryClient();
  const heir = profile.heir;
  const hasHeir = Boolean(heir?.name);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<InvestorHeir>(heir ?? emptyHeir);

  const set = <K extends keyof InvestorHeir>(key: K, value: InvestorHeir[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const startEdit = () => {
    setDraft(heir ?? emptyHeir);
    setEditing(true);
  };

  const saveMutation = useMutation({
    mutationFn: (payload: InvestorHeir) =>
      saveInvestorHeir(profile.investorId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["investor", "profile"] });
      toast.success("Data ahli waris berhasil disimpan.");
      setEditing(false);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Gagal menyimpan data ahli waris."));
    },
  });
  const saving = saveMutation.isPending;

  const nikInvalid = draft.nik.length > 0 && draft.nik.length !== 16;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (nikInvalid) return;
    saveMutation.mutate(draft);
  };

  // Ahli waris menempel pada data investor, jadi profil harus ada lebih dulu
  if (!profile.investorId) {
    return (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
          <UserRoundPlus className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="text-sm text-muted-foreground">
          Lengkapi profil investor terlebih dahulu sebelum menambahkan ahli waris.
        </p>
      </Card>
    );
  }

  if (!hasHeir && !editing) {
    return (
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand">
          <UserRoundPlus className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="text-sm text-muted-foreground">Belum ada data ahli waris</p>
        <Button type="button" size="sm" variant="secondary" onClick={startEdit}>
          <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Tambah Ahli Waris
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">Data Ahli Waris</h2>
        {editing ? null : (
          <Button type="button" variant="secondary" size="sm" onClick={startEdit}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            Edit
          </Button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="heirName">Nama Ahli Waris</Label>
            <Input
              id="heirName"
              maxLength={100}
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="heirRelation">Hubungan</Label>
            <Select
              value={draft.relation || undefined}
              onValueChange={(v) => set("relation", v as HeirRelationValue)}
            >
              <SelectTrigger id="heirRelation">
                <SelectValue placeholder="Pilih hubungan" />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.keys(heirRelationLabel) as HeirRelationValue[]
                ).map((value) => (
                  <SelectItem key={value} value={value}>
                    {heirRelationLabel[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="heirNik">NIK Ahli Waris</Label>
            <Input
              id="heirNik"
              inputMode="numeric"
              maxLength={16}
              value={draft.nik}
              onChange={(e) => set("nik", e.target.value.replace(/\D/g, ""))}
            />
            {nikInvalid ? (
              <p className="text-xs text-danger">NIK harus 16 digit.</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="heirAddress">Alamat Ahli Waris</Label>
            <Textarea
              id="heirAddress"
              rows={3}
              maxLength={255}
              value={draft.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="heirAccount">No. Rekening Ahli Waris</Label>
            <Input
              id="heirAccount"
              inputMode="numeric"
              maxLength={30}
              value={draft.accountNumber}
              onChange={(e) =>
                set("accountNumber", e.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="heirBank">Bank Ahli Waris</Label>
            <Select value={draft.bankName || undefined} onValueChange={(v) => set("bankName", v)}>
              <SelectTrigger id="heirBank">
                <SelectValue placeholder="Pilih bank" />
              </SelectTrigger>
              <SelectContent>
                {INDONESIAN_BANKS.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="heirPhone">Telepon Ahli Waris</Label>
            <Input
              id="heirPhone"
              inputMode="tel"
              maxLength={15}
              value={draft.phone}
              onChange={(e) =>
                set("phone", e.target.value.replace(/[^0-9+]/g, ""))
              }
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Batal
            </Button>
            <Button type="submit" className="flex-1" disabled={saving || nikInvalid}>
              {saving ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-2">
          <FieldRow label="Nama Ahli Waris" value={heir?.name} />
          <FieldRow
            label="Hubungan"
            value={heir?.relation ? heirRelationLabel[heir.relation] : ""}
          />
          <FieldRow label="NIK Ahli Waris" value={heir?.nik} />
          <FieldRow label="Alamat Ahli Waris" value={heir?.address} />
          <FieldRow label="No. Rekening Ahli Waris" value={heir?.accountNumber} />
          <FieldRow label="Bank Ahli Waris" value={heir?.bankName} />
          <FieldRow label="Telepon Ahli Waris" value={heir?.phone} />
        </div>
      )}
    </Card>
  );
}
