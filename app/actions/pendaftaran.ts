"use server";

import { ekskul, pendaftar, tambahPendaftar } from "@/data/ekskul";
import { revalidatePath } from "next/cache";

export async function daftarEkskul(formData: FormData) {
  const ekskulId = Number(formData.get("ekskulId"));
  const nama = String(formData.get("nama") || "").trim();
  const kelas = String(formData.get("kelas") || "").trim();

  if (!nama || !kelas || !ekskulId) {
    throw new Error("Nama dan kelas wajib diisi!");
  }

  const targetEkskul = ekskul.find((e) => e.id === ekskulId);
  if (!targetEkskul) {
    throw new Error("Ekskul tidak ditemukan.");
  }

  // 1. Validasi: Cek kuota penuh
  const anggotaEkskul = pendaftar.filter((p) => p.ekskulId === ekskulId);
  if (anggotaEkskul.length >= targetEkskul.kuota) {
    throw new Error("Pendaftaran ditolak: Kuota ekskul sudah penuh!");
  }

  // 2. Validasi: Cek apakah murid sudah terdaftar di ekskul ini
  const sudahTerdaftar = pendaftar.some(
    (p) =>
      p.ekskulId === ekskulId &&
      p.nama.toLowerCase() === nama.toLowerCase() &&
      p.kelas.toLowerCase() === kelas.toLowerCase(),
  );
  if (sudahTerdaftar) {
    throw new Error("Pendaftaran ditolak: Anda sudah terdaftar di ekskul ini!");
  }

  // 3. Validasi: Cek bentrok jadwal (Hari dan Sesi yang sama dengan ekskul lain yang sudah diikuti)
  const ekskulDiikutiMurid = pendaftar.filter(
    (p) =>
      p.nama.toLowerCase() === nama.toLowerCase() &&
      p.kelas.toLowerCase() === kelas.toLowerCase(),
  );

  for (const p of ekskulDiikutiMurid) {
    const eLain = ekskul.find((e) => e.id === p.ekskulId);
    if (
      eLain &&
      eLain.hari === targetEkskul.hari &&
      eLain.sesi === targetEkskul.sesi
    ) {
      throw new Error(
        `Pendaftaran ditolak: Jadwal bentrok dengan ekskul ${eLain.nama} (${eLain.hari}, Sesi ${eLain.sesi})!`,
      );
    }
  }

  // Jika lolos semua validasi, tambahkan pendaftar
  tambahPendaftar({ ekskulId, nama, kelas });
  revalidatePath(`/ekskul/${ekskulId}`);
  revalidatePath("/saya");
}

export async function batalkanPendaftaran(formData: FormData) {
  const nomor = Number(formData.get("nomor"));
  const ekskulId = Number(formData.get("ekskulId"));

  const index = pendaftar.findIndex((p) => p.nomor === nomor);
  if (index !== -1) {
    pendaftar.splice(index, 1);
  }

  revalidatePath(`/ekskul/${ekskulId}`);
  revalidatePath("/saya");
}
