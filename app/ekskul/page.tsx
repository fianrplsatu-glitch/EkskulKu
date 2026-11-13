import Link from "next/link";
import { Metadata } from "next";
import { ambilSemuaEkskul } from "@/data/ambil";
import {
  pendaftar,
  DAFTAR_KATEGORI,
  DAFTAR_HARI,
  JAM_SESI,
} from "@/data/ekskul";

export const metadata: Metadata = {
  title: "Daftar Ekskul",
};

type SearchParams = Promise<{
  kategori?: string;
  hari?: string;
}>;

export default async function DaftarEkskulPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const selectedKategori = params.kategori || "Semua";
  const selectedHari = params.hari || "Semua";

  // Ambil semua data ekskul
  const semuaEkskul = await ambilSemuaEkskul();

  // Filter ekskul berdasarkan URL secara bersamaan
  const filteredEkskul = semuaEkskul.filter((ekskul) => {
    const matchKategori =
      selectedKategori === "Semua" || ekskul.kategori === selectedKategori;
    const matchHari = selectedHari === "Semua" || ekskul.hari === selectedHari;
    return matchKategori && matchHari;
  });

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Bagian Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daftar ekskul</h1>
        <p className="text-gray-500 text-sm mt-1">
          Temukan dan pilih kegiatan ekstrakurikuler yang kamu sukai.
        </p>
      </div>

      {/* Formulir Saringan */}
      <form
        method="GET"
        className="bg-white p-5 rounded-xl border shadow-sm flex flex-wrap gap-4 items-end"
      >
        <div className="flex-1 min-w-[220px] flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">
            Saring Kategori
          </label>
          <select
            name="kategori"
            defaultValue={selectedKategori}
            className="border border-gray-300 p-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Semua">Semua kategori</option>
            {DAFTAR_KATEGORI.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[220px] flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">
            Saring Hari
          </label>
          <select
            name="hari"
            defaultValue={selectedHari}
            className="border border-gray-300 p-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Semua">Semua hari</option>
            {DAFTAR_HARI.map((hari) => (
              <option key={hari} value={hari}>
                {hari}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
          >
            Terapkan Saringan
          </button>
          <Link
            href="/ekskul"
            className="border border-gray-300 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition text-center"
          >
            Reset
          </Link>
        </div>
      </form>

      {/* Informasi Jumlah Ditemukan */}
      <p className="text-gray-600 text-sm font-medium">
        {filteredEkskul.length} kegiatan tersedia
      </p>

      {/* Daftar Kartu Ekskul atau Pesan Kosong */}
      {filteredEkskul.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-white text-gray-500 text-sm font-medium shadow-sm">
          Tidak ada ekskul yang cocok.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEkskul.map((e) => {
            const jumlahPendaftar = pendaftar.filter(
              (p) => p.ekskulId === e.id,
            ).length;
            const sisaTempat = e.kuota - jumlahPendaftar;
            const isPenuh = sisaTempat <= 0;

            return (
              <div
                key={e.id}
                className="border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full inline-block">
                    {e.kategori}
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-gray-900">
                    {e.nama}
                  </h2>

                  <div className="space-y-1.5 text-sm text-gray-600 pt-1">
                    <p className="flex items-center gap-2">
                      <span className="text-gray-400">📅</span>
                      <span className="font-medium text-gray-700">
                        Hari:
                      </span>{" "}
                      {e.hari}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-400">⏰</span>
                      <span className="font-medium text-gray-700">
                        Sesi:
                      </span>{" "}
                      {e.sesi}. {JAM_SESI[e.sesi]}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-400">👤</span>
                      <span className="font-medium text-gray-700">
                        Pembina:
                      </span>{" "}
                      {e.pembina}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div>
                    {isPenuh ? (
                      <span className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded text-sm inline-block">
                        Penuh
                      </span>
                    ) : (
                      <span className="font-medium text-green-600 text-sm">
                        Sisa {sisaTempat} dari {e.kuota} tempat
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/ekskul/${e.id}`}
                    className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition shadow-sm text-sm"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
