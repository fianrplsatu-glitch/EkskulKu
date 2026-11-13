import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda · EkskulKu",
};

export default function BerandaPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center space-y-8">
        {/* Badge Header */}
        <div className="inline-block">
          <span className="text-xs font-semibold px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-sm">
            Website Ekstrakurikuler Sekolah
          </span>
        </div>

        {/* Judul Utama */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Selamat Datang di <br />
            <span className="text-blue-600">EkskulKu</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Temukan kegiatan ekstrakurikuler favoritmu, kembangkan bakat, dan
            raih pengalaman baru bersama teman-teman di sekolah.
          </p>
        </div>

        {/* Tombol Aksi Utama */}
        <div>
          <Link
            href="/ekskul"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3.5 rounded-xl transition shadow-md shadow-blue-200 text-sm md:text-base"
          >
            Lihat Daftar Ekskul &rarr;
          </Link>
        </div>

        {/* Kotak Kategori di Bagian Bawah */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          {/* Kategori 1: Olahraga */}
          <Link
            href="/ekskul?kategori=Olahraga"
            className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/60 hover:bg-blue-50 transition text-center space-y-1 group"
          >
            <h3 className="font-bold text-blue-600 text-lg group-hover:scale-105 transition-transform">
              Olahraga
            </h3>
            <p className="text-xs text-gray-500">Kembangkan kemampuan fisik</p>
          </Link>

          {/* Kategori 2: Seni */}
          <Link
            href="/ekskul?kategori=Seni"
            className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100/60 hover:bg-purple-50 transition text-center space-y-1 group"
          >
            <h3 className="font-bold text-purple-600 text-lg group-hover:scale-105 transition-transform">
              Seni
            </h3>
            <p className="text-xs text-gray-500">Salurkan kreativitasmu</p>
          </Link>

          {/* Kategori 3: Teknologi */}
          <Link
            href="/ekskul?kategori=Teknologi"
            className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/60 hover:bg-emerald-50 transition text-center space-y-1 group"
          >
            <h3 className="font-bold text-emerald-600 text-lg group-hover:scale-105 transition-transform">
              Teknologi
            </h3>
            <p className="text-xs text-gray-500">Pelajari hal baru</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
