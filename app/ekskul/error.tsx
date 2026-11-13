"use client";

import { useEffect } from "react";

export default function ErrorEkskul({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto mt-12 max-w-xl space-y-6 rounded-lg border border-rose-200 bg-rose-50 p-8 text-center sm:p-12">
      <h2 className="text-2xl font-bold text-rose-700">Ekskul gagal dimuat</h2>
      <p className="text-sm text-slate-600">
        Terjadi kendala saat memuat daftar ekstrakurikuler. Silakan coba lagi.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-rose-600 px-5 py-2 font-medium text-white shadow transition hover:bg-rose-700"
      >
        Coba lagi
      </button>
    </main>
  );
}
