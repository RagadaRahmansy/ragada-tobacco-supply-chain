import React from 'react';
import { formatNumber } from '../../utils/formatters';

export default function AuditLedgerView({
  ledger,
  onOpenOpname
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161922] p-5 rounded-xl border border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10b981] text-[22px]">verified_user</span>
            <h1 className="text-xl font-bold text-white tracking-tight">Buku Besar Mutasi Stok Permanen (Immutable Audit Trail)</h1>
          </div>
          <p className="text-xs text-[#949db2] mt-1">
            Pencatatan setiap butir batang/bungkus rokok yang masuk atau keluar gudang untuk mitigasi risiko selisih dan kebocoran inventori bernilai tinggi.
          </p>
        </div>

        <button
          onClick={onOpenOpname}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#e08f0a] text-black text-xs font-bold shadow-md shadow-[#f59e0b]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">checklist</span>
          <span>Input Hasil Opname Fisik</span>
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#161922] rounded-xl border border-white/5 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Log Mutasi Fisik Terverifikasi</span>
          <span className="text-[10px] text-[#10b981] font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
            Audit Integrity 100%
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12151d] text-[#949db2] uppercase font-bold text-[10px] tracking-wider border-b border-white/5">
                <th className="py-3 px-4">Waktu (WIB)</th>
                <th className="py-3 px-4">Lokasi Fisik</th>
                <th className="py-3 px-4">Produk / SKU</th>
                <th className="py-3 px-4 text-center">Tipe Transaksi</th>
                <th className="py-3 px-4">No Referensi</th>
                <th className="py-3 px-4 text-right">Perubahan (Delta Bks)</th>
                <th className="py-3 px-4 text-right">Saldo Akhir Fisik</th>
                <th className="py-3 px-4">Petugas / Operator</th>
                <th className="py-3 px-4">Catatan Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ledger.map((entry) => {
                const isPositive = entry.delta_bungkus > 0;
                return (
                  <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#949db2]">
                      {new Date(entry.timestamp).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">{entry.location_name}</td>
                    <td className="py-3 px-4">
                      <div>
                        <strong className="text-white block">{entry.product_name}</strong>
                        <span className="text-[10px] text-[#949db2] font-mono">{entry.sku}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        entry.tx_type === 'INBOUND_PABRIK'
                          ? 'bg-[#10b981]/15 text-[#10b981]'
                          : entry.tx_type === 'OUTBOUND_KANVAS'
                          ? 'bg-[#4cd7f6]/15 text-[#4cd7f6]'
                          : entry.tx_type === 'OPNAME_ADJUSTMENT'
                          ? 'bg-[#f59e0b]/15 text-[#f59e0b]'
                          : 'bg-[#8083ff]/15 text-[#8083ff]'
                      }`}>
                        {entry.tx_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#949db2] text-[11px]">{entry.reference_number || '-'}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm">
                      <span className={isPositive ? 'text-[#10b981]' : 'text-[#f43f5e]'}>
                        {isPositive ? `+${formatNumber(entry.delta_bungkus)}` : formatNumber(entry.delta_bungkus)} bks
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                      {formatNumber(entry.final_stock_bungkus)} bks
                    </td>
                    <td className="py-3 px-4 text-[#949db2]">{entry.operator_name}</td>
                    <td className="py-3 px-4 text-[11px] text-[#949db2] italic max-w-xs truncate">{entry.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
