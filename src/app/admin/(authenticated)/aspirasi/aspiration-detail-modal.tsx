'use client';

import { useState, useTransition } from 'react';
import type { Aspiration, AspirationStatus } from '@/types/database';
import {
  updateAspirationStatusAction,
  updateAspirationInternalNoteAction,
  deleteAspirationAction,
} from './actions';

interface AspirationDetailModalProps {
  aspiration: Aspiration | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const STATUS_LABELS: Record<AspirationStatus, { label: string; badgeClass: string; desc: string }> = {
  BARU: {
    label: 'BARU',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    desc: 'Aspirasi baru masuk, belum diverifikasi.',
  },
  DITINJAU: {
    label: 'DITINJAU',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    desc: 'Sedang dipelajari dan diverifikasi oleh tim.',
  },
  DALAM_TINDAK_LANJUT: {
    label: 'DALAM TINDAK LANJUT',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    desc: 'Sedang dikoordinasikan atau dijalankan di lapangan.',
  },
  SELESAI: {
    label: 'SELESAI',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    desc: 'Aspirasi telah tuntas ditindaklanjuti.',
  },
  INFORMASI_DIBERIKAN: {
    label: 'INFORMASI DIBERIKAN',
    badgeClass: 'bg-neutral-100 text-neutral-700 border-neutral-300',
    desc: 'Penjelasan/jawaban telah disampaikan kepada pelapor.',
  },
};

export function AspirationDetailModal({
  aspiration,
  isOpen,
  onClose,
  onUpdated,
}: AspirationDetailModalProps) {
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState<AspirationStatus>(
    aspiration?.status || 'BARU'
  );
  const [noteText, setNoteText] = useState<string>(
    aspiration?.internal_note || ''
  );
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Sync state when aspiration prop changes
  if (aspiration && currentStatus !== aspiration.status && !isPending) {
    setCurrentStatus(aspiration.status);
    setNoteText(aspiration.internal_note || '');
  }

  if (!isOpen || !aspiration) return null;

  const handleStatusChange = (newStatus: AspirationStatus) => {
    setFeedback(null);
    setCurrentStatus(newStatus);

    startTransition(async () => {
      const res = await updateAspirationStatusAction(aspiration.id, newStatus);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Status alur kerja berhasil diperbarui.' });
        onUpdated();
      } else {
        setFeedback({ type: 'error', message: res.error || 'Gagal mengubah status.' });
        setCurrentStatus(aspiration.status);
      }
    });
  };

  const handleSaveNote = () => {
    setFeedback(null);
    startTransition(async () => {
      const res = await updateAspirationInternalNoteAction(aspiration.id, noteText);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Catatan internal berhasil disimpan.' });
        onUpdated();
      } else {
        setFeedback({ type: 'error', message: res.error || 'Gagal menyimpan catatan.' });
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteAspirationAction(aspiration.id);
      if (res.success) {
        onUpdated();
        onClose();
      } else {
        setFeedback({ type: 'error', message: res.error || 'Gagal menghapus aspirasi.' });
      }
    });
  };

  // WhatsApp quick link generator
  const getWhatsAppChatUrl = () => {
    const raw = aspiration.contact.replace(/\D/g, '');
    let clean = raw;
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    else if (!clean.startsWith('62') && clean.length > 0) clean = '62' + clean;

    const text = encodeURIComponent(
      `Halo Bapak/Ibu ${aspiration.name}, kami dari tim KAWAN RIB (Rahmat Ichwan Bahtiar) menghubungi Anda terkait aspirasi yang Anda sampaikan perihal: "${aspiration.subject}".`
    );
    return `https://wa.me/${clean}?text=${text}`;
  };

  const isEmail = aspiration.contact.includes('@');
  const statusMeta = STATUS_LABELS[currentStatus] || STATUS_LABELS.BARU;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusMeta.badgeClass}`}
              >
                {statusMeta.label}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                ID: {aspiration.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs font-medium text-neutral-500">
                {new Date(aspiration.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#191919] leading-snug">
              {aspiration.subject}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Citizen Details Card */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Identitas Pelapor Warga
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-400 block text-[11px]">Nama Warga</span>
                <span className="font-semibold text-neutral-900">{aspiration.name}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Kategori Aspirasi</span>
                <span className="inline-block px-2 py-0.5 rounded bg-neutral-200/60 font-medium text-neutral-800">
                  {aspiration.category || 'Umum'}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Kabupaten / Kota</span>
                <span className="font-medium text-neutral-800">
                  {aspiration.regency || 'Tidak disebutkan'}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Kecamatan</span>
                <span className="font-medium text-neutral-800">
                  {aspiration.district || 'Tidak disebutkan'}
                </span>
              </div>
            </div>

            {/* Direct Citizen Contact Actions */}
            <div className="pt-2 border-t border-neutral-200 flex flex-wrap items-center gap-2">
              <span className="text-neutral-500 font-medium text-[11px]">Kontak:</span>
              <span className="font-mono font-bold text-neutral-800 px-2 py-0.5 bg-white rounded border border-neutral-200">
                {aspiration.contact}
              </span>
              {isEmail ? (
                <a
                  href={`mailto:${aspiration.contact}?subject=Tanggapan%20Aspirasi%20KAWAN%20RIB:%20${encodeURIComponent(aspiration.subject)}`}
                  className="px-2.5 py-1 rounded bg-neutral-800 text-white hover:bg-black font-semibold text-[11px] transition-colors"
                >
                  Kirim Email Balasan &rarr;
                </a>
              ) : (
                <a
                  href={getWhatsAppChatUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-[#25D366] text-white hover:bg-[#1ebd5a] font-semibold text-[11px] inline-flex items-center gap-1 transition-colors shadow-xs"
                >
                  <span>Chat WhatsApp</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 1.036 1.08 1.597.697.621 1.286.814 1.469.901.183.087.29.072.398-.051.107-.123.462-.536.586-.724.124-.188.249-.157.419-.094.17.063 1.082.51 1.27.604.188.094.313.141.358.219.045.078.045.452-.099.857z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Full Message Card */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Uraian Aspirasi
            </h3>
            <div className="p-4 rounded-xl border border-neutral-200 bg-white text-neutral-800 text-sm leading-relaxed whitespace-pre-wrap">
              {aspiration.message}
            </div>
          </div>

          {/* Attachment (if present) */}
          {aspiration.attachment_url && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Lampiran Berkas Pendukung
              </h3>
              <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold text-xs uppercase">
                    FILE
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900 block text-xs truncate max-w-xs">
                      {aspiration.attachment_url.split('/').pop()}
                    </span>
                    <span className="text-[11px] text-neutral-400">Berkas unggahan warga</span>
                  </div>
                </div>
                <a
                  href={aspiration.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 font-semibold text-neutral-700 hover:text-[#AF191A] text-xs transition-colors"
                >
                  Buka / Unduh Berkas &rarr;
                </a>
              </div>
            </div>
          )}

          {/* Status Workflow Selector */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Ubah Status Alur Kerja
              </h3>
              <span className="text-[11px] text-neutral-500 italic">
                {statusMeta.desc}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(STATUS_LABELS) as AspirationStatus[]).map((st) => {
                const meta = STATUS_LABELS[st];
                const isSelected = currentStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    disabled={isPending}
                    onClick={() => handleStatusChange(st)}
                    className={`p-2 rounded-lg border text-left font-semibold text-[11px] transition-all ${
                      isSelected
                        ? 'border-[#AF191A] bg-[#AF191A] text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-[#FFCC00]' : 'bg-neutral-300'
                        }`}
                      />
                      <span>{meta.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confidential Internal Note Editor */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="internal-note" className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Catatan Internal Tim (Rahasia &amp; Tidak Publik)</span>
              </label>
              <span className="text-[10px] text-amber-700 font-medium">Hanya terlihat oleh Admin</span>
            </div>
            <textarea
              id="internal-note"
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Tuliskan catatan tindak lanjut, koordinasi instansi, atau hasil komunikasi dengan warga..."
              className="w-full p-2.5 rounded-lg border border-amber-300 bg-white text-xs text-neutral-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
            />
            <div className="flex justify-end">
              <button
                type="button"
                disabled={isPending}
                onClick={handleSaveNote}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                {isPending ? 'Menyimpan...' : 'Simpan Catatan Internal'}
              </button>
            </div>
          </div>

          {/* Danger Zone: Delete Aspiration */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
            {isConfirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium">Yakin ingin menghapus?</span>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={handleDelete}
                  className="px-2.5 py-1 rounded bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors"
                >
                  Ya, Hapus
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-2.5 py-1 rounded bg-neutral-200 text-neutral-700 font-medium text-xs hover:bg-neutral-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-xs text-red-600 hover:text-red-800 font-semibold transition-colors"
              >
                Hapus Aspirasi (Spam / Tidak Valid)
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 font-semibold text-neutral-700 text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
