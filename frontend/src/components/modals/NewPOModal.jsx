import React, { useState } from 'react';
import { formatRupiah } from '../../utils/formatters';

export default function NewPOModal({
  isOpen,
  onClose,
  warehouses,
  products,
  onSubmit
}) {
  const [supplier, setSupplier] = useState('PT Gudang Garam Tbk (Kediri)');
  const [targetWhId, setTargetWhId] = useState(warehouses[0]?.id || 1);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 1);
  const [qtyKarton, setQtyKarton] = useState(50);
  const [notes, setNotes] = useState('PO rutin pasokan bulanan armada pabrik.');

  if (!isOpen) return null;

  const currentProd = products.find(p => p.id === parseInt(selectedProductId)) || products[0];
  const hargaKarton = currentProd?.harga_beli_karton || 24640000;
  const totalNilai = qtyKarton * hargaKarton;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      supplier_name: supplier,
      target_warehouse_id: parseInt(targetWhId),
      notes,
      items: [
        {
          product_id: parseInt(selectedProductId),
          quantity_karton: parseInt(qtyKarton),
          harga_karton_rp: hargaKarton
        }
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-[#161922] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#8083ff] text-[22px]">add_box</span>
            <div>
              <h3 className="text-base font-bold text-white">Terbitkan PO Pabrik Rokok</h3>
              <p className="text-xs text-[#949db2]">Pemesanan resmi skala tronton/kontainer ke pabrikan</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#949db2] hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-xs">
          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Pabrik Pemasok (Supplier):</label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
            >
              <option value="PT Gudang Garam Tbk (Kediri)">PT Gudang Garam Tbk (Kediri Plant)</option>
              <option value="PT HM Sampoerna Tbk (Surabaya)">PT HM Sampoerna Tbk (Rungkut Plant)</option>
              <option value="PT Djarum (Kudus)">PT Djarum (Kudus Plant)</option>
              <option value="PT Wismilak Inti Makmur (Surabaya)">PT Wismilak Inti Makmur (Surabaya)</option>
            </select>
          </div>

          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Gudang Penerima (Bongkar Muat):</label>
            <select
              value={targetWhId}
              onChange={(e) => setTargetWhId(e.target.value)}
              className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
            >
              {warehouses.filter(w => w.location_type !== 'VAN_KANVASER').map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">Produk Rokok:</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">Jumlah Karton (Dus):</label>
              <input
                type="number"
                min="1"
                value={qtyKarton}
                onChange={(e) => setQtyKarton(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none font-mono"
                required
              />
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="bg-[#12151d] p-3 rounded-lg border border-white/5 flex flex-col gap-1">
            <div className="flex justify-between text-[#949db2]">
              <span>Harga Modal Pabrik:</span>
              <span className="font-mono text-white">{formatRupiah(hargaKarton)} / Karton</span>
            </div>
            <div className="flex justify-between text-[#949db2]">
              <span>Total Slop / Bungkus:</span>
              <span className="font-mono text-[#4cd7f6]">{qtyKarton * 80} Slop ({qtyKarton * 800} Bks)</span>
            </div>
            <div className="flex justify-between text-[#949db2] pt-1 border-t border-white/5 font-bold">
              <span className="text-white">Total Nilai Tagihan PO:</span>
              <span className="font-mono text-[#10b981] text-sm">{formatRupiah(totalNilai)}</span>
            </div>
          </div>

          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Catatan Dokumen Jalan & Ekspedisi:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="2"
              className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none resize-none"
            />
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
              className="px-4 py-2 rounded-lg bg-[#8083ff] hover:bg-[#6c70f5] text-white font-bold cursor-pointer shadow-md shadow-[#8083ff]/20"
            >
              Terbitkan Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
