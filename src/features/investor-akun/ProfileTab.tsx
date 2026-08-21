import { useState } from "react";
import type { FormEvent } from "react";
import { Loader2, Pencil } from "lucide-react";

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

import { FieldRow } from "./FieldRow";
import { VerifyEmailBanner } from "./VerifyEmailBanner";
import {
  genderLabel,
  investorTypeLabel,
  type InvestorAccountType,
  type InvestorGender,
  type InvestorProfile,
} from "./types";
import { INDONESIAN_BANKS } from "./utils";

interface ProfileTabProps {
  profile: InvestorProfile;
  onRequestVerification: (draft: InvestorProfile) => Promise<void>;
}

export function ProfileTab({ profile, onRequestVerification }: Readonly<ProfileTabProps>) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [draft, setDraft] = useState(profile);

  const set = <K extends keyof InvestorProfile>(key: K, value: InvestorProfile[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const startEdit = () => {
    setDraft(profile);
    setSentTo(null);
    setEditing(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onRequestVerification(draft);
      setSentTo(profile.email);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {sentTo ? <VerifyEmailBanner email={sentTo} /> : null}

      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-semibold text-foreground">Data Pribadi</h2>
          {editing ? null : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={startEdit}
              className="shrink-0"
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Edit Profil
            </Button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            {/* --- Bagian Input Form yang Lain Tetap Sama --- */}
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Nama Depan</Label>
                <Input
                  id="firstName"
                  value={draft.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Nama Belakang</Label>
                <Input
                  id="lastName"
                  value={draft.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="investorType">Tipe Investor</Label>
              <Select
                value={draft.investorType}
                onValueChange={(v) => set("investorType", v as InvestorAccountType)}
              >
                <SelectTrigger id="investorType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individu</SelectItem>
                  <SelectItem value="corporation">Korporasi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select
                value={draft.gender}
                onValueChange={(v) => set("gender", v as InvestorGender)}
              >
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Laki-laki</SelectItem>
                  <SelectItem value="women">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nik">NIK</Label>
              <Input
                id="nik"
                inputMode="numeric"
                maxLength={16}
                value={draft.nik}
                onChange={(e) => set("nik", e.target.value.replace(/\D/g, ""))}
                required
              />
              {draft.nik.length > 0 && draft.nik.length !== 16 ? (
                <p className="text-xs text-danger">NIK harus 16 digit.</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Nomor HP</Label>
              <Input
                id="phone"
                inputMode="tel"
                value={draft.phone}
                onChange={(e) => set("phone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                rows={3}
                value={draft.address}
                onChange={(e) => set("address", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="accountNumber">No. Rekening</Label>
              <Input
                id="accountNumber"
                inputMode="numeric"
                value={draft.accountNumber}
                onChange={(e) => set("accountNumber", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bankName">Nama Bank</Label>
              <Select
                value={draft.bankName}
                onValueChange={(v) => set("bankName", v)}
              >
                <SelectTrigger id="bankName">
                  <SelectValue placeholder="Pilih bank" />
                </SelectTrigger>
                <SelectContent>
                  {INDONESIAN_BANKS.map((bank: string) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : null}
                Simpan Perubahan
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-2">
            <FieldRow label="Tipe Investor" value={investorTypeLabel[profile.investorType]} />
            <FieldRow label="Jenis Kelamin" value={genderLabel[profile.gender]} />
            <FieldRow label="NIK" value={profile.nik} />
            <FieldRow label="Nomor HP" value={profile.phone} />
            <FieldRow label="Alamat" value={profile.address} />
            <FieldRow label="No. Rekening" value={profile.accountNumber} />
            <FieldRow label="Nama Bank" value={profile.bankName} />
            {profile.privy ? <FieldRow label="Privy ID" value={profile.privy} /> : null}
          </div>
        )}
      </Card>
    </div>
  );
}