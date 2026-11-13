"use client";

import { useActionState } from "react";
import { daftarEkskul as actionDaftarEkskul } from "@/app/actions/pendaftaran";

type ActionState = { error?: string; success?: string };

type PilihanEkskul = {
  id: number;
  nama: string;
  hari: string;
  sesi: number;
  kuota: number;
  jumlahAnggota: number;
};

export default function FormPendaftaran({
  daftarEkskul,
}: {
  daftarEkskul: PilihanEkskul[];
}) {
  const initialState: ActionState = {};
  const [state, formAction, isPending] = useActionState(
    actionDaftarEkskul,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.success && (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          {state.success}
        </p>
      )}
      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
          {state.error}
        </p>
      )}
      {daftarEkskul.every((item) => item.jumlahAnggota >= item.kuota) && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Semua ekskul sudah mencapai kuota.
        </p>
      )}

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Nama lengkap
        </span>
        <input
          name="nama"
          type="text"
          autoComplete="name"
          maxLength={80}
          required
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Masukkan nama lengkap"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Kelas
        </span>
        <input
          name="kelas"
          type="text"
          maxLength={40}
          required
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Contoh: X RPL 1"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Pilih ekskul
        </span>
        <select
          name="ekskulId"
          required
          defaultValue=""
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="" disabled>
            Pilih kegiatan
          </option>
          {daftarEkskul.map((item) => {
            const penuh = item.jumlahAnggota >= item.kuota;
            return (
              <option key={item.id} value={item.id} disabled={penuh}>
                {item.nama} — {item.hari}, sesi {item.sesi}
                {penuh ? " (Kuota penuh)" : ""}
              </option>
            );
          })}
        </select>
      </label>

      <button
        type="submit"
        disabled={
          isPending ||
          daftarEkskul.every((item) => item.jumlahAnggota >= item.kuota)
        }
        className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isPending ? "Mengirim pendaftaran..." : "Daftar sekarang"}
      </button>
    </form>
  );
}
