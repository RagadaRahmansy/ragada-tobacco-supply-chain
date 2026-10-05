import React from 'react';
import { formatRupiah, formatNumber } from '../../utils/formatters';

export default function ProcurementView({
  orders,
  onOpenNewPO,
  onReceivePO
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161922] p-5 rounded-xl border border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8083ff] text-[22px]">factory</span>
            <h1 className="text-xl font-bold text-white tracking-tight">Pengadaan & Purchase Order (PO) Pabrikan Rokok</h1>
          </div>
          <p className="text-xs text-[#949db2] mt-1">
            Alur pemesanan skala tronton dan kontainer ke pabrik rokok (Kediri, Surabaya, Kudus) hingga penerimaan gudang (GRN).
          </p>
        </div>

        <button
          onClick={onOpenNewPO}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8083ff] hover:bg-[#6c70f5] text-white text-xs font-semibold shadow-md shadow-[#8083ff]/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Terbitkan PO Pabrik Baru</span>
        </button>
      </div>

      {/* PO Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {orders.map((po) => {
          const isReceived = po.status === 'SELESAI';
          return (
            <div key={po.id} className="bg-[#161922] rounded-xl border border-white/5 p-5 flex flex-col justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">local_shipping</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{po.po_number}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isReceived ? 'bg-[#10b981]/15 text-[#10b981]' : 'bg-[#f59e0b]/15 text-[#f59e0b]'
                      }`}>
                        {po.status === 'SELESAI' ? '✓ DITERIMA (GRN)' : 'DALAM PENGIRIMAN'}
                      </span>
                    </div>
                    <span className="text-xs text-[#949db2]">{po.supplier_name} • Tujuan: {po.target_warehouse_name}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#949db2] uppercase font-bold block">Total Nilai PO</span>
                  <span className="text-base font-bold text-[#10b981] font-mono">{formatRupiah(po.total_nilai_rp)}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-[#12151d] p-3 rounded-lg border border-white/5">
                <span className="text-[10px] font-bold text-[#949db2] uppercase tracking-wider block mb-2">Item Rokok Dipesan:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {po.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#161922] text-xs">
                      <div>
                        <strong className="text-white block">{item.product_name}</strong>
                        <span className="text-[10px] text-[#949db2] font-mono">{item.sku}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-white block">{item.quantity_karton} Karton</span>
                        <span className="text-[10px] text-[#949db2] font-mono">@{formatRupiah(item.harga_karton_rp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                <p className="text-[#949db2] italic text-[11px]">
                  Catatan: {po.notes || 'Tidak ada catatan logistik khusus.'}
                </p>

                {!isReceived ? (
                  <button
                    onClick={() => onReceivePO(po.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10b981] hover:bg-[#0ea371] text-white font-semibold shadow-md shadow-[#10b981]/20 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_box</span>
                    <span>Konfirmasi Penerimaan Barang (GRN)</span>
                  </button>
                ) : (
                  <span className="text-[#10b981] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Stok Fisik Telah Ditambahkan ke Gudang
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
