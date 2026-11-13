"use client";

import { useActionState } from "react";
import { daftarEkskul } from "@/app/actions/pendaftaran";

type PendaftaranState = { error?: string; success?: string };

export default function FormPendaftaranEkskul({
  ekskulId,
  isPenuh,
}: {
  ekskulId: number;
  isPenuh: boolean;
}) {
  const initialState: PendaftaranState = {};
  const [state, formAction, isPending] = useActionState(
    daftarEkskul,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="ekskulId" value={ekskulId} />

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
        >
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {state.success}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="nama-siswa"
            className="mb-1 block text-sm font-semibold text-gray-700"
          >
            Nama Siswa
          </label>
          <input
            id="nama-siswa"
            type="text"
            name="nama"
            autoComplete="name"
            maxLength={80}
            required
            placeholder="Contoh: Budi Santoso"
            className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="kelas-siswa"
            className="mb-1 block text-sm font-semibold text-gray-700"
          >
            Kelas
          </label>
          <input
            id="kelas-siswa"
            type="text"
            name="kelas"
            maxLength={40}
            required
            placeholder="Contoh: XI RPL 1"
            className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPenuh || isPending}
        className={`w-full rounded-xl py-3 text-sm font-medium text-white shadow-sm transition ${
          isPenuh || isPending
            ? "cursor-not-allowed bg-gray-400"
            : "bg-blue-600 shadow-blue-200 hover:bg-blue-700"
        }`}
      >
        {isPenuh
          ? "Pendaftaran Ditutup (Penuh)"
          : isPending
            ? "Mengirim pendaftaran..."
            : "Daftar Sekarang"}
      </button>
    </form>
  );
}
