export interface PublicProduct {
  id: string;
  name: string;
  scheme: "Musyarakah" | "Mudharabah";
  duration: string;
  returnRange: string;
}

export const publicProducts: PublicProduct[] = [
  {
    id: "p1",
    name: "Proyek Properti Syariah A",
    scheme: "Musyarakah",
    duration: "12 bulan",
    returnRange: "8–12% p.a.",
  },
  {
    id: "p2",
    name: "Pembiayaan UMKM Kuliner",
    scheme: "Mudharabah",
    duration: "9 bulan",
    returnRange: "9–13% p.a.",
  },
  {
    id: "p3",
    name: "Kemitraan Agribisnis Hijau",
    scheme: "Musyarakah",
    duration: "18 bulan",
    returnRange: "10–14% p.a.",
  },
  {
    id: "p4",
    name: "Modal Kerja Distribusi Halal",
    scheme: "Mudharabah",
    duration: "6 bulan",
    returnRange: "7–10% p.a.",
  },
];