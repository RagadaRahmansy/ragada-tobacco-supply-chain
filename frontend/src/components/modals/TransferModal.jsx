import React, { useState } from 'react';

export default function TransferModal({
  isOpen,
  onClose,
  warehouses,
  products,
  onSubmit
}) {
  const [sourceId, setSourceId] = useState(warehouses[0]?.id || 1);
  const [destId, setDestId] = useState(warehouses.find(w => w.location_type === 'VAN_KANVASER')?.id || warehouses[1]?.id || 2);
  const [productId, setProductId] = useState(products[0]?.id || 1);
  const [satuan, setSatuan] = useState('KARTON');
  const [qty, setQty] = useState(5);
  const [operator, setOperator] = useState('Admin Logistik Pusat');
  const [notes, setNotes] = useState('Muat stok pagi armada kanvaser rute harian.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      source_location_id: parseInt(sourceId),
      destination_location_id: parseInt(destId),
      product_id: parseInt(productId),
      satuan,
      quantity: parseInt(qty),
      operator_name: operator,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-[#161922] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">swap_horiz</span>
            <div>
              <h3 className="text-base font-bold text-white">Transfer Stok & Muat Mobil Kanvaser</h3>
              <p className="text-xs text-[#949db2]">Mutasi fisik antar gudang atau muat stok ke mobil box sales</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#949db2] hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">Gudang Asal (Keluar):</label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">Lokasi Tujuan (Masuk):</label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
              >
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
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
              <label className="text-[#949db2] font-semibold block mb-1">Satuan Mutasi:</label>
              <select
                value={satuan}
                onChange={(e) => setSatuan(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
              >
                <option value="KARTON">Karton (Dus - 80 Slop)</option>
                <option value="BAL">Bal (10 Slop)</option>
                <option value="SLOP">Slop (10 Bungkus)</option>
                <option value="BUNGKUS">Bungkus</option>
              </select>
            </div>
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">Jumlah:</label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Petugas / Operator:</label>
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Catatan Dokumen Jalan:</label>
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
              className="px-4 py-2 rounded-lg bg-[#4cd7f6] hover:bg-[#3bc4e2] text-black font-bold cursor-pointer shadow-md shadow-[#4cd7f6]/20"
            >
              Konfirmasi & Eksekusi Mutasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
