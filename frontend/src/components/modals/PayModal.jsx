import React, { useState } from 'react';
import { formatRupiah } from '../../utils/formatters';

export default function PayModal({
  isOpen,
  onClose,
  salesOrder,
  onSubmit
}) {
  const [bayar, setBayar] = useState(salesOrder?.sisa_piutang_rp || 0);

  if (!isOpen || !salesOrder) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(salesOrder.id, parseFloat(bayar) || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-[#161922] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Catat Pembayaran Piutang Toko</h3>
            <p className="text-xs text-[#949db2]">{salesOrder.customer_name} ({salesOrder.invoice_number})</p>
          </div>
          <button onClick={onClose} className="text-[#949db2] hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-xs">
          <div className="bg-[#12151d] p-3 rounded-lg border border-white/5 flex flex-col gap-1">
            <div className="flex justify-between text-[#949db2]">
              <span>Total Faktur:</span>
              <span className="font-mono text-white">{formatRupiah(salesOrder.total_nilai_rp)}</span>
            </div>
            <div className="flex justify-between text-[#949db2]">
              <span>Sudah Terbayar:</span>
              <span className="font-mono text-[#10b981]">{formatRupiah(salesOrder.terbayar_rp)}</span>
            </div>
            <div className="flex justify-between text-[#949db2] pt-1 border-t border-white/5 font-bold">
              <span className="text-[#f43f5e]">Sisa Piutang Saat Ini:</span>
              <span className="font-mono text-[#f43f5e] text-sm">{formatRupiah(salesOrder.sisa_piutang_rp)}</span>
            </div>
          </div>

          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Nominal Pembayaran Diterima (Rp):</label>
            <input
              type="number"
              min="1000"
              max={salesOrder.sisa_piutang_rp}
              value={bayar}
              onChange={(e) => setBayar(e.target.value)}
              className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none font-mono text-sm"
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setBayar(salesOrder.sisa_piutang_rp)}
                className="px-2.5 py-1 rounded bg-[#10b981]/15 text-[#10b981] font-semibold text-[11px] cursor-pointer hover:bg-[#10b981]/25"
              >
                Bayar Lunas Penuh
              </button>
              <button
                type="button"
                onClick={() => setBayar(Math.round(salesOrder.sisa_piutang_rp / 2))}
                className="px-2.5 py-1 rounded bg-white/5 text-[#949db2] font-semibold text-[11px] cursor-pointer hover:bg-white/10"
              >
                Bayar 50%
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#202430] hover:bg-white/10 text-white font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#10b981] hover:bg-[#0ea371] text-white font-bold cursor-pointer shadow-md shadow-[#10b981]/20"
            >
              Simpan Pembayaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
