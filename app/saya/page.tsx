import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";
import { pendaftar, ekskul, JAM_SESI } from "@/data/ekskul";
import { batalkanPendaftaran } from "@/app/actions/pendaftaran";

export const metadata: Metadata = {
  title: "Ekskul Saya",
};

type SearchParams = Promise<{
  nama?: string;
  kelas?: string;
}>;

async function EkskulSayaContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const cariNama = (params.nama || "").trim().toLowerCase();
  const cariKelas = (params.kelas || "").trim().toLowerCase();

  const hasilPendaftar = pendaftar.filter((p) => {
    const matchNama =
      cariNama === "" || p.nama.toLowerCase().includes(cariNama);
    const matchKelas =
      cariKelas === "" || p.kelas.toLowerCase().includes(cariKelas);
    return matchNama && matchKelas;
  });

  return (
    <div className="space-y-6">
      {/* Formulir Pencarian Berdasarkan Nama & Kelas */}
      <form
        method="GET"
        className="bg-gray-50 border p-4 rounded-lg flex flex-wrap gap-4 items-end"
      >
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold mb-1">
            Cari Nama Siswa
          </label>
          <input
            type="text"
            name="nama"
            defaultValue={params.nama || ""}
            placeholder="Contoh: Rudi"
            className="w-full border p-2 rounded bg-white text-sm"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold mb-1">Kelas</label>
          <input
            type="text"
            name="kelas"
            defaultValue={params.kelas || ""}
            placeholder="Contoh: XI RPL 2"
            className="w-full border p-2 rounded bg-white text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm transition"
          >
            Tampilkan
          </button>
        </div>
      </form>

      {/* Daftar Ekskul yang diikuti */}
      {cariNama === "" && cariKelas === "" ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50 text-gray-500">
          Silakan masukkan <strong>Nama</strong> dan <strong>Kelas</strong> Anda
          di atas untuk melihat daftar ekskul yang Anda ikuti.
        </div>
      ) : hasilPendaftar.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50 text-gray-500">
          Tidak ditemukan pendaftaran dengan nama &quot;{params.nama}&quot; di
          kelas &quot;{params.kelas}&quot;.
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-600">
            Ditemukan {hasilPendaftar.length} pendaftaran:
          </p>
          <div className="grid grid-cols-1 gap-4">
            {hasilPendaftar.map((p) => {
              const detailEkskul = ekskul.find((e) => e.id === p.ekskulId);
              if (!detailEkskul) return null;

              return (
                <div
                  key={p.nomor}
                  className="border rounded-lg p-5 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                        {detailEkskul.kategori}
                      </span>
                      <span className="text-xs text-gray-500">
                        No. Pendaftaran: #{p.nomor}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold">{detailEkskul.nama}</h2>
                    <p className="text-sm text-gray-600">
                      Jadwal:{" "}
                      <span className="font-medium">
                        {detailEkskul.hari}, Sesi {detailEkskul.sesi} (
                        {JAM_SESI[detailEkskul.sesi]})
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Peserta: {p.nama} ({p.kelas}) · Pembina:{" "}
                      {detailEkskul.pembina}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Link
                      href={`/ekskul/${detailEkskul.id}`}
                      className="text-xs border px-3 py-2 rounded hover:bg-gray-50 font-medium text-center"
                    >
                      Lihat Detail
                    </Link>
                    <form action={batalkanPendaftaran}>
                      <input type="hidden" name="nomor" value={p.nomor} />
                      <input
                        type="hidden"
                        name="ekskulId"
                        value={detailEkskul.id}
                      />
                      <button
                        type="submit"
                        className="text-xs bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 font-medium transition"
                      >
                        Batalkan Pendaftaran
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EkskulSayaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ekskul Saya</h1>
        <Link
          href="/ekskul"
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Cari Ekskul Lain
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="text-center py-12 text-gray-500">Memuat data...</div>
        }
      >
        <EkskulSayaContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
