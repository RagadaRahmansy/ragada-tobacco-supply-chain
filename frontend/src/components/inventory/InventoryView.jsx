import React, { useState } from 'react';
import { formatRupiah, formatNumber } from '../../utils/formatters';

export default function InventoryView({
  inventory,
  warehouses,
  selectedLocation,
  setSelectedLocation,
  onOpenTransfer,
  onOpenOpname
}) {
  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  // UoM Converter Widget State
  const [converterQty, setConverterQty] = useState(1);
  const [converterUnit, setConverterUnit] = useState('KARTON'); // KARTON, BAL, SLOP, BUNGKUS
  const [converterSku, setConverterSku] = useState('SKU-GG-SURYA16');

  const filteredInventory = inventory.filter((item) => {
    const matchLoc = !selectedLocation || item.location_id === parseInt(selectedLocation);
    const matchSearch = !search ||
      item.product_name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchLow = !filterLowStock || item.is_low_stock;
    return matchLoc && matchSearch && matchLow;
  });

  // Calculate quick conversion
  const selectedProduct = inventory.find(i => i.sku === converterSku) || inventory[0];
  let calculatedBungkus = 0;
  if (selectedProduct) {
    if (converterUnit === 'KARTON') calculatedBungkus = converterQty * 800;
    else if (converterUnit === 'BAL') calculatedBungkus = converterQty * 100;
    else if (converterUnit === 'SLOP') calculatedBungkus = converterQty * 10;
    else calculatedBungkus = converterQty;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & UoM Converter Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Section Header & Search */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#161922] p-5 rounded-xl border border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8083ff] text-[22px]">inventory_2</span>
              <h1 className="text-xl font-bold text-white tracking-tight">Inventori Multi-Depo & Konversi Satuan Bertingkat</h1>
            </div>
            <p className="text-xs text-[#949db2] mt-1">
              Pelacakan presisi stok fisik rokok di level Karton (Dus), Bal, Slop, dan Bungkus eceran tanpa selisih agregasi.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-white/5">
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#949db2] text-[18px]">search</span>
              <input
                type="text"
                placeholder="Cari merek, SKU rokok, atau produsen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#12151d] text-white text-xs pl-9 pr-3 py-2 rounded-lg border border-white/10 outline-none focus:border-[#8083ff]"
              />
            </div>

            <button
              onClick={() => setFilterLowStock(!filterLowStock)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                filterLowStock
                  ? 'bg-[#f43f5e]/20 text-[#f43f5e] border-[#f43f5e]/40'
                  : 'bg-[#12151d] text-[#949db2] border-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span>Stok Kritis Saja</span>
            </button>
          </div>
        </div>

        {/* Right: Live Interactive UoM Converter */}
        <div className="lg:col-span-4 bg-[#12151d] p-5 rounded-xl border border-[#8083ff]/30 flex flex-col justify-between shadow-lg shadow-[#8083ff]/5">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#4cd7f6] text-[16px]">calculate</span>
              Kalkulator Konversi Satuan Rokok
            </span>
            <span className="text-[10px] font-mono text-[#10b981]">Multi-UoM</span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2">
            <div>
              <label className="text-[10px] text-[#949db2] uppercase font-bold block mb-1">Jumlah</label>
              <input
                type="number"
                min="1"
                value={converterQty}
                onChange={(e) => setConverterQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-[#161922] text-white text-xs px-2.5 py-1.5 rounded border border-white/10 outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#949db2] uppercase font-bold block mb-1">Satuan</label>
              <select
                value={converterUnit}
                onChange={(e) => setConverterUnit(e.target.value)}
                className="w-full bg-[#161922] text-white text-xs px-2.5 py-1.5 rounded border border-white/10 outline-none cursor-pointer"
              >
                <option value="KARTON">Karton (80 Slop)</option>
                <option value="BAL">Bal (10 Slop)</option>
                <option value="SLOP">Slop (10 Bungkus)</option>
                <option value="BUNGKUS">Bungkus</option>
              </select>
            </div>
          </div>

          {/* Result Output */}
          <div className="bg-[#161922] p-2.5 rounded-lg border border-white/5 text-xs flex flex-col gap-1">
            <div className="flex justify-between text-[#949db2]">
              <span>Setara Slop:</span>
              <strong className="text-white font-mono">{formatNumber(calculatedBungkus / 10)} Slop</strong>
            </div>
            <div className="flex justify-between text-[#949db2]">
              <span>Setara Bungkus:</span>
              <strong className="text-[#4cd7f6] font-mono">{formatNumber(calculatedBungkus)} Bungkus</strong>
            </div>
            <div className="flex justify-between text-[#949db2] pt-1 border-t border-white/5">
              <span>Estimasi Nilai HJE:</span>
              <strong className="text-[#10b981] font-mono">{formatRupiah(calculatedBungkus * 36000)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-[#161922] rounded-xl border border-white/5 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Rincian Fisik Stok Terdistribusi</span>
            <span className="text-[10px] font-mono bg-white/5 text-[#949db2] px-2 py-0.5 rounded">
              {filteredInventory.length} SKU Baris
            </span>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12151d] text-[#949db2] uppercase font-bold text-[10px] tracking-wider border-b border-white/5">
                <th className="py-3 px-4">SKU / Nama Produk</th>
                <th className="py-3 px-4">Golongan / Cukai</th>
                <th className="py-3 px-4">Lokasi Fisik</th>
                <th className="py-3 px-4 text-center">Karton (Dus)</th>
                <th className="py-3 px-4 text-center">Bal</th>
                <th className="py-3 px-4 text-center">Slop</th>
                <th className="py-3 px-4 text-center">Bungkus</th>
                <th className="py-3 px-4 text-right">Nilai Modal Gudang</th>
                <th className="py-3 px-4 text-center">Status Buffer</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{item.product_name}</span>
                      <span className="text-[10px] font-mono text-[#949db2]">{item.sku} • {item.manufacturer}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.golongan === 'SKM' ? 'bg-[#8083ff]/15 text-[#8083ff]' : 'bg-[#f59e0b]/15 text-[#f59e0b]'
                      }`}>
                        {item.golongan}
                      </span>
                      <span className="text-[10px] text-[#949db2] font-mono">{item.cukai_year}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#4cd7f6]">
                        {item.location_type === 'VAN_KANVASER' ? 'local_shipping' : 'warehouse'}
                      </span>
                      <span className="text-white">{item.location_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-white text-sm">
                    {item.total_karton}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#949db2]">
                    {item.total_bal}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#4cd7f6]">
                    {item.total_slop}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-[#949db2]">
                    {formatNumber(item.quantity_bungkus)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#10b981]">
                    {formatRupiah(item.nilai_aset_rp)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.is_low_stock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f43f5e]/15 text-[#f43f5e] font-semibold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]"></span>
                        ROP Alert
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] font-semibold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                        Aman
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={onOpenTransfer}
                        title="Mutasi / Pindah Stok"
                        className="p-1 rounded bg-[#12151d] hover:bg-white/10 text-[#4cd7f6] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                      </button>
                      <button
                        onClick={onOpenOpname}
                        title="Audit Opname Fisik"
                        className="p-1 rounded bg-[#12151d] hover:bg-white/10 text-[#f59e0b] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">checklist</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
