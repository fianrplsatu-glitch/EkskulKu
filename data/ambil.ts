import { ekskul, pendaftar } from "@/data/ekskul";

export function ambilSemuaEkskul() {
  return ekskul;
}

export function ambilEkskul(id: number) {
  return ekskul.find((e) => e.id === id);
}

// Daftar anggota satu ekskul, urut nomor pendaftaran
export function ambilAnggota(ekskulId: number) {
  return pendaftar
    .filter((p) => p.ekskulId === ekskulId)
    .sort((a, b) => a.nomor - b.nomor);
}
