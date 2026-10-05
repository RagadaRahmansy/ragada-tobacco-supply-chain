import React, { useState } from 'react';

export default function OpnameModal({
  isOpen,
  onClose,
  warehouses,
  products,
  onSubmit
}) {
  const [locationId, setLocationId] = useState(warehouses[0]?.id || 1);
  const [productId, setProductId] = useState(products[0]?.id || 1);
  const [countUnit, setCountUnit] = useState('KARTON'); // KARTON, SLOP, BUNGKUS
  const [qty, setQty] = useState(10);
  const [operator, setOperator] = useState('Auditor Fisik Gudang');
  const [notes, setNotes] = useState('Stock opname rutin akhir pekan.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    let totalBks = parseInt(qty);
    if (countUnit === 'KARTON') totalBks = parseInt(qty) * 800;
    else if (countUnit === 'SLOP') totalBks = parseInt(qty) * 10;

    onSubmit({
      location_id: parseInt(locationId),
      product_id: parseInt(productId),
      physical_count_bungkus: totalBks,
      operator_name: operator,
      notes: `Hitungan Fisik: ${qty} ${countUnit}. ${notes}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-[#161922] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#f59e0b] text-[22px]">checklist</span>
            <div>
              <h3 className="text-base font-bold text-white">Daily Stock Opname (Audit Fisik)</h3>
              <p className="text-xs text-[#949db2]">Verifikasi fisik rokok untuk mendeteksi dan mencegah kebocoran stok</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#949db2] hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-xs">
          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Pilih Lokasi yang Diaudit:</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
            >
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Pilih Produk Rokok:</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">Satuan Hitung Fisik:</label>
              <select
                value={countUnit}
                onChange={(e) => setCountUnit(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
              >
                <option value="KARTON">Karton (Dus)</option>
                <option value="SLOP">Slop</option>
                <option value="BUNGKUS">Bungkus</option>
              </select>
            </div>
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">Jumlah Fisik Terhitung:</label>
              <input
                type="number"
                min="0"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Petugas Auditor / Saksi:</label>
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Keterangan / Berita Acara:</label>
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
              className="px-4 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#e08f0a] text-black font-bold cursor-pointer shadow-md shadow-[#f59e0b]/20"
            >
              Simpan & Catat Selisih ke Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
