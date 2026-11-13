"use server";

import { ekskul, pendaftar, tambahPendaftar } from "@/data/ekskul";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

type PendaftaranState = { error?: string; success?: string };

export async function daftarEkskul(
  previousState: PendaftaranState,
  formData: FormData,
): Promise<PendaftaranState> {
  void previousState;

  const ekskulIdValue = formData.get("ekskulId");
  const namaValue = formData.get("nama");
  const kelasValue = formData.get("kelas");

  if (
    typeof ekskulIdValue !== "string" ||
    typeof namaValue !== "string" ||
    typeof kelasValue !== "string"
  ) {
    return { error: "Nama, kelas, dan ekskul wajib diisi." };
  }

  const ekskulId = Number(ekskulIdValue);
  const nama = namaValue.trim();
  const kelas = kelasValue.trim();

  if (!Number.isSafeInteger(ekskulId) || ekskulId < 1 || !nama || !kelas) {
    return { error: "Nama, kelas, dan ekskul wajib diisi dengan benar." };
  }

  if (nama.length > 80 || kelas.length > 40) {
    return {
      error: "Nama maksimal 80 karakter dan kelas maksimal 40 karakter.",
    };
  }

  const targetEkskul = ekskul.find((e) => e.id === ekskulId);
  if (!targetEkskul) {
    return { error: "Ekskul tidak ditemukan." };
  }

  const anggotaEkskul = pendaftar.filter((p) => p.ekskulId === ekskulId);
  if (anggotaEkskul.length >= targetEkskul.kuota) {
    return { error: "Pendaftaran ditolak: Kuota ekskul sudah penuh." };
  }

  const sudahTerdaftar = pendaftar.some(
    (p) =>
      p.ekskulId === ekskulId &&
      p.nama.toLowerCase() === nama.toLowerCase() &&
      p.kelas.toLowerCase() === kelas.toLowerCase(),
  );
  if (sudahTerdaftar) {
    return { error: "Anda sudah terdaftar di ekskul ini." };
  }

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
      return {
        error: `Jadwal bentrok dengan ekskul ${eLain.nama} (${eLain.hari}, Sesi ${eLain.sesi}).`,
      };
    }
  }

  tambahPendaftar({ ekskulId, nama, kelas });

  // Simpan identitas ke cookie untuk fitur label "Kamu"
  const cookieStore = await cookies();
  cookieStore.set("ekskul_user_nama", nama, { path: "/" });
  cookieStore.set("ekskul_user_kelas", kelas, { path: "/" });

  revalidatePath(`/ekskul/${ekskulId}`);
  revalidatePath("/saya");
  revalidatePath("/pendaftaran");

  return {
    success: `Pendaftaran ${nama} untuk ${targetEkskul.nama} berhasil.`,
  };
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
  revalidatePath("/pendaftaran");
}
