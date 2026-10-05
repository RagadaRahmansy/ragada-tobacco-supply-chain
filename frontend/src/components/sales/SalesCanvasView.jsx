import React from 'react';
import { formatRupiah, formatNumber } from '../../utils/formatters';

export default function SalesCanvasView({
  orders,
  onOpenNewSales,
  onPaySales
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161922] p-5 rounded-xl border border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">local_shipping</span>
            <h1 className="text-xl font-bold text-white tracking-tight">Distribusi Kanvaser & Manajemen Piutang Toko</h1>
          </div>
          <p className="text-xs text-[#949db2] mt-1">
            Faktur penjualan armada kanvaser keliling ke warung kelontong, pasar grosir, dan penagihan piutang tempo (TOP).
          </p>
        </div>

        <button
          onClick={onOpenNewSales}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4cd7f6] hover:bg-[#3bc4e2] text-black text-xs font-bold shadow-md shadow-[#4cd7f6]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Buat Faktur Toko Baru</span>
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-[#161922] rounded-xl border border-white/5 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Daftar Faktur & Buku Piutang Toko</span>
          <span className="text-[10px] text-[#949db2] font-mono">{orders.length} Faktur Terbit</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12151d] text-[#949db2] uppercase font-bold text-[10px] tracking-wider border-b border-white/5">
                <th className="py-3 px-4">No Faktur / Tanggal</th>
                <th className="py-3 px-4">Nama Toko & Alamat</th>
                <th className="py-3 px-4">Armada Pengirim</th>
                <th className="py-3 px-4">Termin (TOP)</th>
                <th className="py-3 px-4 text-right">Total Nilai</th>
                <th className="py-3 px-4 text-right">Terbayar</th>
                <th className="py-3 px-4 text-right">Sisa Piutang</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((so) => {
                const isOverdue = so.status === 'OVERDUE';
                const isLunas = so.status === 'LUNAS';
                return (
                  <tr key={so.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-white">{so.invoice_number}</span>
                        <span className="text-[10px] text-[#949db2]">
                          {new Date(so.order_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <strong className="text-white">{so.customer_name}</strong>
                        <span className="text-[10px] text-[#949db2] truncate max-w-xs">{so.customer_address}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-[#949db2] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#4cd7f6]">local_shipping</span>
                        {so.source_location_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs text-white">
                        {so.payment_term.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-white">
                      {formatRupiah(so.total_nilai_rp)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[#10b981]">
                      {formatRupiah(so.terbayar_rp)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#f43f5e]">
                      {formatRupiah(so.sisa_piutang_rp)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isLunas
                          ? 'bg-[#10b981]/15 text-[#10b981]'
                          : isOverdue
                          ? 'bg-[#f43f5e]/15 text-[#f43f5e]'
                          : 'bg-[#f59e0b]/15 text-[#f59e0b]'
                      }`}>
                        {isLunas ? '✓ LUNAS' : isOverdue ? '⚠️ OVERDUE' : 'BELUM LUNAS'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {!isLunas ? (
                        <button
                          onClick={() => onPaySales(so)}
                          className="px-2.5 py-1 rounded bg-[#8083ff]/20 hover:bg-[#8083ff] text-[#8083ff] hover:text-white font-semibold transition-all cursor-pointer text-[11px]"
                        >
                          Catat Bayar
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#949db2]">-</span>
                      )}
                    </td>
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
