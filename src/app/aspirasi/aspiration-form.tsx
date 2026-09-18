'use client';

import { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { submitAspirationAction, type SubmitAspirationResult } from './actions';

const REGENCY_OPTIONS = [
  'Kab. Polewali Mandar, Provinsi Sulawesi Barat',
  'Kabupaten Majene',
  'Kabupaten Mamuju',
  'Kabupaten Mamasa',
  'Kabupaten Pasangkayu',
  'Kabupaten Mamuju Tengah',
  'Luar Wilayah Kab. Polewali Mandar, Provinsi Sulawesi Barat / Lainnya',
];

const CATEGORY_OPTIONS = [
  'Infrastruktur & Jalan',
  'Pendidikan & Literasi',
  'Kesehatan & Balita',
  'Pertanian & Ketahanan Pangan',
  'Ekonomi & Kesejahteraan',
  'Pelayanan Publik & Tata Kelola',
  'Lainnya',
];

export function AspirationForm() {
  const [isPending, startTransition] = useTransition();
  const [submissionResult, setSubmissionResult] = useState<SubmitAspirationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await submitAspirationAction(formData);
      if (res.success) {
        setSubmissionResult(res);
        form.reset();
        setSelectedFile(null);
      } else {
        setErrorMessage(res.error || 'Gagal mengirimkan aspirasi. Silakan periksa kembali formulir.');
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran berkas melebihi batas 10 MB.');
        e.target.value = '';
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleCopyRef = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SUCCESS CONFIRMATION VIEW
  if (submissionResult?.success) {
    const refId = submissionResult.referenceId || 'ASP-BERHASIL';
    return (
      <div className="p-8 sm:p-12 rounded-2xl border border-neutral-200 bg-white shadow-md text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-black shadow-xs">
          ✓
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider border border-emerald-200">
            Aspirasi Terkirim
          </span>
          <h2 className="text-2xl font-black text-[#191919]">
            Terima Kasih Atas Partisipasi Anda!
          </h2>
          <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            {submissionResult.message ||
              'Aspirasi Anda telah berhasil tercatat dalam sistem dan akan dipelajari serta diverifikasi oleh tim advokasi Rahmat Ichwan Bahtiar.'}
          </p>
        </div>

        {/* Reference Number Box */}
        <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 max-w-md mx-auto space-y-2">
          <span className="text-xs font-semibold text-neutral-500 block uppercase tracking-wider">
            Nomor Tiket / Referensi Pelaporan
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-lg sm:text-xl font-extrabold text-[#AF191A] tracking-wider">
              {refId}
            </span>
            <button
              type="button"
              onClick={() => handleCopyRef(refId)}
              className="px-2.5 py-1 text-xs font-semibold rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors shadow-2xs"
            >
              {copied ? 'Tersalin ✓' : 'Salin'}
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-200">
            Simpan nomor tiket ini untuk keperluan konfirmasi saat tim kami menghubungi Anda.
          </p>
        </div>

        {/* Privacy Note */}
        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-800 flex items-center justify-center gap-2 max-w-md mx-auto">
          <span>🔒</span>
          <span>Data kontak dan isi laporan Anda dijamin kerahasiaannya.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setSubmissionResult(null)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#AF191A] hover:bg-[#8e1415] text-white font-bold text-xs transition-colors shadow-xs"
          >
            Kirim Aspirasi Lainnya
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 font-bold text-xs transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // PUBLIC SUBMISSION FORM VIEW
  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-6 text-left"
    >
      {/* Privacy Guarantee Box */}
      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#AF191A]/10 text-[#AF191A] flex items-center justify-center shrink-0 text-sm font-bold">
          🔒
        </div>
        <div className="text-xs space-y-0.5">
          <span className="font-bold text-[#191919] block">
            Jaminan Privasi &amp; Kerahasiaan Warga
          </span>
          <p className="text-neutral-600 leading-relaxed">
            Identitas dan nomor kontak Anda tidak pernah dipublikasikan di website. Informasi ini hanya dapat diakses oleh tim internal untuk verifikasi dan tindak lanjut lapangan.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 animate-in fade-in">
          {errorMessage}
        </div>
      )}

      {/* Bot Honeypot Trap (Hidden visually) */}
      <div className="hidden" aria-hidden="true" tabIndex={-1}>
        <label htmlFor="hp_code_check">Jangan isi bidang ini jika Anda manusia</label>
        <input
          type="text"
          id="hp_code_check"
          name="hp_code_check"
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      {/* Section 1: Identitas & Kontak */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1.5">
          1. Data Pelapor
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="input-name" className="text-xs font-bold text-neutral-800">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="input-name"
              name="name"
              required
              placeholder="Contoh: Budi Santoso"
              className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="input-contact" className="text-xs font-bold text-neutral-800">
              No. WhatsApp / Email Aktif <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="input-contact"
              name="contact"
              required
              placeholder="Contoh: 0812-3456-7890 atau budi@email.com"
              className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
            />
            <span className="text-[10px] text-neutral-400 block">
              Untuk konfirmasi dan penyampaian progres tindak lanjut
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="input-regency" className="text-xs font-bold text-neutral-800">
              Kabupaten / Kota <span className="text-red-500">*</span>
            </label>
            <select
              id="input-regency"
              name="regency"
              required
              defaultValue=""
              className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs bg-white focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
            >
              <option value="" disabled>
                -- Pilih Kabupaten / Kota --
              </option>
              {REGENCY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="input-district" className="text-xs font-bold text-neutral-800">
              Kecamatan / Kelurahan (Opsional)
            </label>
            <input
              type="text"
              id="input-district"
              name="district"
              placeholder="Contoh: Tinambung / Wonomulyo, Kab. Polewali Mandar, Provinsi Sulawesi Barat"
              className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Isi Aspirasi */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-100 pb-1.5">
          2. Pokok Permasalahan &amp; Aspirasi
        </h3>

        <div className="space-y-1">
          <label htmlFor="input-category" className="text-xs font-bold text-neutral-800">
            Kategori Bidang <span className="text-red-500">*</span>
          </label>
          <select
            id="input-category"
            name="category"
            required
            defaultValue="Infrastruktur & Jalan"
            className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs bg-white focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="input-subject" className="text-xs font-bold text-neutral-800">
            Perihal / Judul Aspirasi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="input-subject"
            name="subject"
            required
            placeholder="Tuliskan pokok aspirasi secara ringkas dan jelas"
            className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="input-message" className="text-xs font-bold text-neutral-800">
            Uraian Lengkap Aspirasi <span className="text-red-500">*</span>
          </label>
          <textarea
            id="input-message"
            name="message"
            rows={5}
            required
            placeholder="Uraikan permasalahan, kronologi kejadian, titik lokasi spesifik, atau usulan solusi konkret yang Anda harapkan..."
            className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden leading-relaxed"
          />
        </div>

        {/* File Attachment */}
        <div className="space-y-1.5">
          <label htmlFor="input-attachment" className="text-xs font-bold text-neutral-800 block">
            Lampirkan Foto / Dokumen Pendukung (Opsional)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              id="input-attachment"
              name="attachment"
              accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={handleFileChange}
              className="text-xs text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-neutral-300 file:text-xs file:font-semibold file:bg-neutral-50 hover:file:bg-neutral-100 cursor-pointer"
            />
            {selectedFile && (
              <span className="text-[11px] text-emerald-600 font-semibold truncate max-w-xs">
                ✓ {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            )}
          </div>
          <span className="text-[10px] text-neutral-400 block">
            Mendukung format JPG, PNG, WebP (maks. 5MB) atau PDF (maks. 10MB).
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-neutral-500 text-center sm:text-left">
          Dengan mengirim formulir ini, Anda menyatakan informasi yang disampaikan adalah benar dan bertanggung jawab.
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#AF191A] hover:bg-[#8e1415] text-white font-bold text-xs transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Mengirimkan Aspirasi...</span>
            </>
          ) : (
            <span>Kirim Aspirasi Sekarang &rarr;</span>
          )}
        </button>
      </div>
    </form>
  );
}
