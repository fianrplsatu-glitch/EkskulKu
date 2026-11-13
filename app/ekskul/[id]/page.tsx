import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { ambilEkskul, ambilAnggota } from "@/data/ambil";
import { JAM_SESI } from "@/data/ekskul";
import { batalkanPendaftaran } from "@/app/actions/pendaftaran";
import FormPendaftaranEkskul from "./FormPendaftaranEkskul";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const e = await ambilEkskul(Number(id));
  if (!e) {
    return { title: "Ekskul tidak ditemukan" };
  }
  return { title: e.nama };
}

// Komponen terpisah untuk Anggota dengan Suspense & Delay 1.5 detik
async function DaftarAnggotaSection({
  ekskulId,
  kuota,
}: {
  ekskulId: number;
  kuota: number;
}) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const anggota = await ambilAnggota(ekskulId);
  const cookieStore = await cookies();
  const myNama = (
    cookieStore.get("ekskul_user_nama")?.value || ""
  ).toLowerCase();
  const myKelas = (
    cookieStore.get("ekskul_user_kelas")?.value || ""
  ).toLowerCase();

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Anggota terdaftar</h2>
        <span className="text-sm font-medium text-gray-600">
          {anggota.length} dari {kuota} tempat terisi
        </span>
      </div>

      {anggota.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Belum ada anggota.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {anggota.map((m, idx) => {
            const isMe =
              myNama &&
              myKelas &&
              m.nama.toLowerCase() === myNama &&
              m.kelas.toLowerCase() === myKelas;

            return (
              <div
                key={m.nomor}
                className="py-3 flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {idx + 1}. {m.nama}
                  </span>
                  <span className="text-gray-500">· {m.kelas}</span>
                  {isMe && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      Kamu
                    </span>
                  )}
                </div>
                <form action={batalkanPendaftaran}>
                  <input type="hidden" name="nomor" value={m.nomor} />
                  <input type="hidden" name="ekskulId" value={ekskulId} />
                  <button
                    type="submit"
                    className="text-red-600 hover:text-red-800 text-xs font-semibold px-2.5 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition"
                  >
                    Batalkan
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Komponen Konten Detail Utama
async function DetailContent({ params }: Props) {
  const { id } = await params;
  const e = await ambilEkskul(Number(id));

  if (!e) {
    notFound();
  }

  const initialAnggota = await ambilAnggota(e.id);
  const sisaTempat = e.kuota - initialAnggota.length;
  const isPenuh = sisaTempat <= 0;

  return (
    <div className="space-y-6">
      <Link
        href="/ekskul"
        className="text-blue-600 hover:underline text-sm font-medium inline-block"
      >
        &larr; Kembali ke Daftar Ekskul
      </Link>

      {/* Info Utama Ekskul */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 rounded-full inline-block">
              {e.kategori}
            </span>
            <h1 className="text-3xl font-bold mt-2 text-gray-900">{e.nama}</h1>
          </div>
          <div>
            {isPenuh ? (
              <span className="bg-red-50 text-red-600 font-bold px-3 py-1 rounded-full text-sm inline-block">
                Penuh
              </span>
            ) : (
              <span className="bg-green-50 text-green-700 font-medium px-3 py-1 rounded-full text-sm inline-block">
                Sisa {sisaTempat} dari {e.kuota} tempat
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 pt-4 border-t border-gray-100">
          <div className="space-y-1.5">
            <p>
              <span className="font-semibold text-gray-700">Hari:</span>{" "}
              {e.hari}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Sesi:</span> Sesi{" "}
              {e.sesi} ({JAM_SESI[e.sesi]})
            </p>
          </div>
          <div className="space-y-1.5">
            <p>
              <span className="font-semibold text-gray-700">Pembina:</span>{" "}
              {e.pembina}
            </p>
          </div>
        </div>
      </div>

      {/* Formulir Pendaftaran */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold">Formulir Pendaftaran Ekskul</h2>
        <FormPendaftaranEkskul ekskulId={e.id} isPenuh={isPenuh} />
      </div>

      {/* Bagian Anggota dengan Suspense */}
      <Suspense
        fallback={
          <div className="bg-white border rounded-2xl p-8 text-center text-gray-500 font-medium shadow-sm">
            Memuat anggota...
          </div>
        }
      >
        <DaftarAnggotaSection ekskulId={e.id} kuota={e.kuota} />
      </Suspense>
    </div>
  );
}

export default function DetailEkskulPage({ params }: Props) {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <Suspense
        fallback={
          <div className="text-center py-12 text-gray-500">
            Memuat detail ekskul...
          </div>
        }
      >
        <DetailContent params={params} />
      </Suspense>
    </main>
  );
}
