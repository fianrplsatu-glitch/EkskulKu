import Link from "next/link";
import FormPendaftaran from "./FormPendaftaran";
import { ambilAnggota, ambilSemuaEkskul } from "@/data/ambil";

export default function PendaftaranPage() {
  const daftarEkskul = ambilSemuaEkskul().map((item) => ({
    id: item.id,
    nama: item.nama,
    hari: item.hari,
    sesi: item.sesi,
    kuota: item.kuota,
    jumlahAnggota: ambilAnggota(item.id).length,
  }));

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900 sm:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
        >
          ← Kembali ke daftar ekskul
        </Link>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            EkskulKu
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Form pendaftaran
          </h1>
          <p className="mb-8 mt-3 text-slate-600">
            Isi data diri dan pilih ekskul yang ingin diikuti.
          </p>

          <FormPendaftaran daftarEkskul={daftarEkskul} />
        </section>
      </div>
    </main>
  );
}
