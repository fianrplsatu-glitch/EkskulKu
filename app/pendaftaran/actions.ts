"use server";

import { revalidatePath } from "next/cache";
import { ambilAnggota, ambilEkskul } from "@/data/ambil";
import { tambahPendaftar } from "@/data/ekskul";

export async function daftarkanPendaftar(
  previousState: { error?: string; success?: string },
  formData: FormData,
): Promise<{ error?: string; success?: string }> {
  void previousState;

  const nama = formData.get("nama");
  const kelas = formData.get("kelas");
  const ekskulIdValue = formData.get("ekskulId");

  if (
    typeof nama !== "string" ||
    typeof kelas !== "string" ||
    typeof ekskulIdValue !== "string"
  ) {
    return { error: "Lengkapi nama, kelas, dan pilihan ekskul." };
  }

  const namaBersih = typeof nama === "string" ? nama.trim() : "";
  const kelasBersih = typeof kelas === "string" ? kelas.trim() : "";

  if (!namaBersih || !kelasBersih) {
    return { error: "Lengkapi nama, kelas, dan pilihan ekskul." };
  }

  if (namaBersih.length > 80 || kelasBersih.length > 40) {
    return {
      error: "Nama maksimal 80 karakter dan kelas maksimal 40 karakter.",
    };
  }

  const ekskulId = Number(ekskulIdValue);
  if (!Number.isSafeInteger(ekskulId) || ekskulId < 1) {
    return { error: "Pilihan ekskul tidak valid." };
  }

  const ekskul = ambilEkskul(ekskulId);
  if (!ekskul) {
    return { error: "Ekskul yang dipilih tidak ditemukan." };
  }

  if (ambilAnggota(ekskulId).length >= ekskul.kuota) {
    return {
      error: "Kuota ekskul ini sudah penuh. Silakan pilih ekskul lain.",
    };
  }

  tambahPendaftar({
    ekskulId,
    nama: namaBersih,
    kelas: kelasBersih,
  });
  revalidatePath("/pendaftaran");

  return {
    success: `Pendaftaran ${namaBersih} untuk ${ekskul.nama} berhasil.`,
  };
}
