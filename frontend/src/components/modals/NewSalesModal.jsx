import React, { useState } from 'react';
import { formatRupiah } from '../../utils/formatters';

export default function NewSalesModal({
  isOpen,
  onClose,
  warehouses,
  products,
  onSubmit
}) {
  const [customerName, setCustomerName] = useState('Toko Madura Jaya (Jl. Ngagel)');
  const [customerPhone, setCustomerPhone] = useState('081234567888');
  const [customerAddress, setCustomerAddress] = useState('Jl. Ngagel Jaya Selatan No. 89, Surabaya');
  const [sourceId, setSourceId] = useState(warehouses.find(w => w.location_type === 'VAN_KANVASER')?.id || warehouses[0]?.id || 1);
  const [paymentTerm, setPaymentTerm] = useState('TEMPO_7_HARI');
  const [productId, setProductId] = useState(products[0]?.id || 1);
  const [satuanJual, setSatuanJual] = useState('SLOP');
  const [qty, setQty] = useState(10);
  const [terbayar, setTerbayar] = useState(0);

  if (!isOpen) return null;

  const currentProd = products.find(p => p.id === parseInt(productId)) || products[0];
  let hargaSatuan = currentProd?.harga_jual_slop || 330000;
  if (satuanJual === 'KARTON') hargaSatuan = currentProd?.harga_jual_karton || 25600000;
  else if (satuanJual === 'BUNGKUS') hargaSatuan = currentProd?.harga_jual_bungkus || 35000;
  else if (satuanJual === 'BAL') hargaSatuan = (currentProd?.harga_jual_slop || 330000) * 10;

  const totalNilai = qty * hargaSatuan;
  const sisaPiutang = Math.max(0, totalNilai - terbayar);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      source_location_id: parseInt(sourceId),
      payment_term: paymentTerm,
      terbayar_rp: parseFloat(terbayar) || 0,
      items: [
        {
          product_id: parseInt(productId),
          satuan_jual: satuanJual,
          quantity: parseInt(qty),
          harga_satuan_rp: hargaSatuan
        }
      ]
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-[#161922] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#4cd7f6] text-[22px]">receipt_long</span>
            <div>
              <h3 className="text-base font-bold text-white">Buat Faktur Penjualan Toko / Kanvas</h3>
              <p className="text-xs text-[#949db2]">Faktur pengiriman rokok ke toko kelontong & piutang tempo</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#949db2] hover:text-white cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">Nama Toko / Pelanggan:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">No HP / WhatsApp Toko:</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Alamat Toko:</label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">Armada Kanvaser / Gudang Asal:</label>
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
              <label className="text-[#949db2] font-semibold block mb-1">Sistem Pembayaran (TOP):</label>
              <select
                value={paymentTerm}
                onChange={(e) => setPaymentTerm(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
              >
                <option value="COD">Cash on Delivery (Tunai)</option>
                <option value="TEMPO_7_HARI">Tempo 7 Hari</option>
                <option value="TEMPO_14_HARI">Tempo 14 Hari</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="text-[#949db2] font-semibold block mb-1">Produk Rokok:</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">Satuan Jual:</label>
              <select
                value={satuanJual}
                onChange={(e) => setSatuanJual(e.target.value)}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none"
              >
                <option value="SLOP">Slop (10 Bks)</option>
                <option value="BAL">Bal (10 Slop)</option>
                <option value="KARTON">Karton (Dus)</option>
                <option value="BUNGKUS">Bungkus</option>
              </select>
            </div>
            <div>
              <label className="text-[#949db2] font-semibold block mb-1">Jumlah:</label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[#949db2] font-semibold block mb-1">Uang Muka / Pembayaran Tunai Awal (Rp):</label>
            <input
              type="number"
              min="0"
              value={terbayar}
              onChange={(e) => setTerbayar(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#12151d] text-white p-2.5 rounded-lg border border-white/10 outline-none font-mono"
            />
          </div>

          {/* Pricing Preview */}
          <div className="bg-[#12151d] p-3 rounded-lg border border-white/5 flex flex-col gap-1">
            <div className="flex justify-between text-[#949db2]">
              <span>Total Nilai Tagihan:</span>
              <span className="font-mono text-white font-bold">{formatRupiah(totalNilai)}</span>
            </div>
            <div className="flex justify-between text-[#949db2]">
              <span>Uang Tunai Diterima:</span>
              <span className="font-mono text-[#10b981]">{formatRupiah(terbayar)}</span>
            </div>
            <div className="flex justify-between text-[#949db2] pt-1 border-t border-white/5 font-bold">
              <span className="text-[#f43f5e]">Sisa Piutang Tempo Toko:</span>
              <span className="font-mono text-[#f43f5e] text-sm">{formatRupiah(sisaPiutang)}</span>
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
              className="px-4 py-2 rounded-lg bg-[#4cd7f6] hover:bg-[#3bc4e2] text-black font-bold cursor-pointer shadow-md shadow-[#4cd7f6]/20"
            >
              Terbitkan Faktur Toko
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
