import React from 'react';

export default function Header({
  warehouses,
  selectedLocation,
  setSelectedLocation,
  onOpenTransfer,
  onOpenNewPO,
  onOpenOpname
}) {
  return (
    <header className="h-16 bg-[#161922] border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Location Filter */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#8083ff] text-[20px]">warehouse</span>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#949db2]">Filter Depo / Armada:</span>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-[#12151d] text-white text-xs font-semibold rounded-lg px-2.5 py-1 border border-white/10 outline-none focus:border-[#8083ff] cursor-pointer"
          >
            <option value="">Semua Lokasi Konsolidasi (Nasional)</option>
            {warehouses.map((wh) => (
              <option key={wh.id} value={wh.id}>
                {wh.location_type === 'VAN_KANVASER' ? '🚚 ' : '🏢 '}
                {wh.name} {wh.vehicle_plate ? `(${wh.vehicle_plate})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Quick Action Buttons & Status */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12151d] border border-white/5 text-xs text-[#949db2]">
          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
          <span>FastAPI 8002: <strong className="text-white">Active</strong></span>
        </div>

        <button
          onClick={onOpenTransfer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202430] hover:bg-[#2b3040] text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#4cd7f6]">swap_horiz</span>
          <span>Muat Kanvaser</span>
        </button>

        <button
          onClick={onOpenOpname}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#202430] hover:bg-[#2b3040] text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#f59e0b]">checklist</span>
          <span>Stock Opname</span>
        </button>

        <button
          onClick={onOpenNewPO}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#8083ff] hover:bg-[#6c70f5] text-white text-xs font-semibold shadow-md shadow-[#8083ff]/20 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add_box</span>
          <span>PO Pabrikan</span>
        </button>
      </div>
    </header>
  );
}
