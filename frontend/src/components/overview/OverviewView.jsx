import React, { useState } from 'react';
import {
  ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { formatRupiah, formatNumber } from '../../utils/formatters';

export default function OverviewView({
  overviewData,
  onOpenNewPO,
  onOpenTransfer,
  onNavigateTab
}) {
  const [chartMode, setChartMode] = useState('all'); // 'all' | 'omset' | 'volume'

  const kpi = overviewData?.kpi || {
    total_nilai_aset_rp: 0,
    total_karton_equivalent: 0,
    total_slop_equivalent: 0,
    total_bungkus_inventory: 0,
    total_piutang_berjalan_rp: 0,
    total_piutang_overdue_rp: 0,
    total_omset_bulan_ini_rp: 0,
    low_stock_count: 0,
    total_warehouses: 3,
    total_vans: 2
  };

  const trendData = overviewData?.trend_data || [];
  const brandDistribution = overviewData?.brand_distribution || [];
  const insights = overviewData?.insights || [];

  const brandColors = ['#8083ff', '#4cd7f6', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="flex flex-col gap-6">
      {/* Executive Title Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Tobacco Supply Chain Overview</h1>
          <p className="text-xs text-[#949db2] mt-0.5">Konsolidasi logistik multi-depo, arus piutang tempo, dan telemetri perputaran stok rokok nasional</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
            Pita Cukai 2026 Terverifikasi
          </span>
        </div>
      </div>

      {/* KPI Metric Strip (4 Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Nilai Aset Stok */}
        <div className="bg-[#161922] p-5 rounded-xl border border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-[#8083ff]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#949db2]">Total Nilai Aset Gudang</span>
            <span className="material-symbols-outlined text-[#8083ff] text-[20px]">account_balance_wallet</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono">
              {formatRupiah(kpi.total_nilai_aset_rp)}
            </div>
            <span className="text-[11px] text-[#4cd7f6] font-medium">Modal Beli Pabrikan Terakumulasi</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-[#949db2]">
            <span>Total Gudang & Depo</span>
            <span className="font-semibold text-white">{kpi.total_warehouses} Hub Aktif</span>
          </div>
        </div>

        {/* Card 2: Total Fisik Rokok (Karton & Slop) */}
        <div className="bg-[#161922] p-5 rounded-xl border border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-[#4cd7f6]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#949db2]">Fisik Rokok Tersedia</span>
            <span className="material-symbols-outlined text-[#4cd7f6] text-[20px]">inventory</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono">
              {formatNumber(kpi.total_karton_equivalent)} <span className="text-sm font-normal text-[#949db2]">Karton (Dus)</span>
            </div>
            <span className="text-[11px] text-[#10b981] font-medium">
              ≈ {formatNumber(kpi.total_slop_equivalent)} Slop ({formatNumber(kpi.total_bungkus_inventory)} Bks)
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-[#949db2]">
            <span>Stok di Van Kanvaser</span>
            <span className="font-semibold text-[#4cd7f6]">{kpi.total_vans} Mobil Box Keliling</span>
          </div>
        </div>

        {/* Card 3: Piutang Toko Kelontong Berjalan */}
        <div className="bg-[#161922] p-5 rounded-xl border border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-[#f59e0b]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#949db2]">Piutang Toko (Tempo / TOP)</span>
            <span className="material-symbols-outlined text-[#f59e0b] text-[20px]">receipt_long</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono">
              {formatRupiah(kpi.total_piutang_berjalan_rp)}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#f43f5e]"></span>
              <span className="text-[11px] text-[#f43f5e] font-semibold">
                Overdue: {formatRupiah(kpi.total_piutang_overdue_rp)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-[#949db2]">
            <span>Termin 7 & 14 Hari</span>
            <button onClick={() => onNavigateTab('sales')} className="text-[#8083ff] font-semibold hover:underline cursor-pointer">
              Kelola Piutang →
            </button>
          </div>
        </div>

        {/* Card 4: Status Pasokan & Buffer Alert */}
        <div className="bg-[#161922] p-5 rounded-xl border border-white/5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-[#10b981]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#949db2]">Kesehatan Stok & ROP</span>
            <span className="material-symbols-outlined text-[#10b981] text-[20px]">health_and_safety</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono">
              {kpi.low_stock_count > 0 ? (
                <span className="text-[#f59e0b]">{kpi.low_stock_count} SKU Kritis</span>
              ) : (
                <span className="text-[#10b981]">Semua Aman</span>
              )}
            </div>
            <span className="text-[11px] text-[#949db2]">Mendekati batas buffer stock 3 hari</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-[#949db2]">
            <span>Reorder Point (ROP)</span>
            <button onClick={onOpenNewPO} className="text-[#10b981] font-semibold hover:underline cursor-pointer">
              + Pesan ke Pabrik
            </button>
          </div>
        </div>
      </section>

      {/* Main Cockpit Section (8:4 Layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Dual-Axis Dynamic Revenue & Volume Chart */}
          <div className="bg-[#161922] p-6 rounded-xl border border-white/5 flex flex-col shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white">Omset Penjualan & Perputaran Volume Karton</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8083ff]/20 text-[#8083ff] border border-[#8083ff]/30">
                    Dual-Axis
                  </span>
                </div>
                <p className="text-xs text-[#949db2]">Korelasi pertumbuhan nilai omset (Rp Juta) terhadap volume fisik karton yang terdistribusi</p>
              </div>

              {/* View Switcher Buttons */}
              <div className="flex items-center gap-1 bg-[#12151d] p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setChartMode('all')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                    chartMode === 'all' ? 'bg-[#8083ff] text-white shadow-sm' : 'text-[#949db2] hover:text-white'
                  }`}
                >
                  Dual-Axis
                </button>
                <button
                  onClick={() => setChartMode('omset')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                    chartMode === 'omset' ? 'bg-[#8083ff] text-white shadow-sm' : 'text-[#949db2] hover:text-white'
                  }`}
                >
                  Omset Saja
                </button>
                <button
                  onClick={() => setChartMode('volume')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                    chartMode === 'volume' ? 'bg-[#8083ff] text-white shadow-sm' : 'text-[#949db2] hover:text-white'
                  }`}
                >
                  Karton Saja
                </button>
              </div>
            </div>

            {/* High-Fidelity Chart Canvas */}
            <div className="w-full h-72 bg-[#0b0e14] rounded-xl p-4 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="omsetGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8083ff" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#8083ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262a35" vertical={false} />
                  <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#949db2', fontSize: 11 }} />
                  
                  {/* Left Axis: Omset (Juta Rp) */}
                  {(chartMode === 'all' || chartMode === 'omset') && (
                    <YAxis
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `Rp ${v}M`}
                      tick={{ fill: '#8083ff', fontSize: 11 }}
                    />
                  )}

                  {/* Right Axis: Volume (Karton) */}
                  {(chartMode === 'all' || chartMode === 'volume') && (
                    <YAxis
                      yAxisId={chartMode === 'volume' ? 'left' : 'right'}
                      orientation={chartMode === 'volume' ? 'left' : 'right'}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v} Dus`}
                      tick={{ fill: '#4cd7f6', fontSize: 11 }}
                    />
                  )}

                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#1c1f2a', borderColor: '#313540', color: '#dfe2f1', borderRadius: '8px' }}
                    formatter={(val, name) => [
                      name === 'Omset Penjualan' ? `Rp ${Number(val).toLocaleString()} Juta` : `${val} Karton`,
                      name
                    ]}
                  />

                  {/* Volume Bar */}
                  {(chartMode === 'all' || chartMode === 'volume') && (
                    <Bar
                      yAxisId={chartMode === 'volume' ? 'left' : 'right'}
                      name="Volume Karton"
                      dataKey="volume_karton"
                      fill="#4cd7f6"
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                      opacity={0.85}
                    />
                  )}

                  {/* Omset Curve */}
                  {(chartMode === 'all' || chartMode === 'omset') && (
                    <Area
                      yAxisId="left"
                      type="monotone"
                      name="Omset Penjualan"
                      dataKey="omset_juta"
                      stroke="#8083ff"
                      strokeWidth={3}
                      fill="url(#omsetGradient)"
                      activeDot={{ r: 6, fill: '#8083ff' }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Telemetry Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/5 text-xs">
              <div>
                <span className="text-[#949db2] block">RUNRATE OMSET TAHUNAN</span>
                <span className="font-bold text-white font-mono text-sm">Rp 26,8 Milyar</span>
              </div>
              <div>
                <span className="text-[#949db2] block">RATA-RATA HARGA PER KARTON</span>
                <span className="font-bold text-[#4cd7f6] font-mono text-sm">Rp 19.490.000</span>
              </div>
              <div>
                <span className="text-[#949db2] block">KECEPATAN PERPUTARAN (DOH)</span>
                <span className="font-bold text-[#10b981] font-mono text-sm">11.4 Hari (Fast Moving)</span>
              </div>
            </div>
          </div>

          {/* AI Supply Chain & Loss Prevention Radar */}
          <div className="bg-[#161922] p-6 rounded-xl border border-white/5 flex flex-col shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f59e0b] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f59e0b]"></span>
                </span>
                <h2 className="text-base font-semibold text-white">Radar Logistik & Mitigasi Risiko Stok</h2>
              </div>
              <span className="text-xs text-[#949db2] font-mono">Engine: Tobacco FMCG Telemetry v2.4</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {insights.map((ins, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-[#12151d] border border-white/5 flex items-start gap-3">
                  <span className={`material-symbols-outlined text-[20px] mt-0.5 ${
                    ins.type === 'warning' ? 'text-[#f59e0b]' : ins.type === 'alert' ? 'text-[#f43f5e]' : 'text-[#4cd7f6]'
                  }`}>
                    {ins.type === 'warning' ? 'warning' : ins.type === 'alert' ? 'emergency_home' : 'info'}
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-white">{ins.title}</h3>
                    <p className="text-xs text-[#949db2] mt-0.5 leading-relaxed">{ins.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Donut Chart: Komposisi Nilai Stok per Pabrikan */}
          <div className="bg-[#161922] p-6 rounded-xl border border-white/5 flex flex-col shadow-sm">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-base font-semibold text-white">Distribusi Merek Rokok</h2>
              <span className="text-[10px] uppercase font-bold text-[#949db2]">Share Aset</span>
            </div>
            <p className="text-xs text-[#949db2] pb-3">Porsi nilai modal inventori berdasarkan pabrikan utama</p>

            <div className="w-full h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={brandDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value_rp"
                    nameKey="name"
                  >
                    {brandDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={brandColors[index % brandColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#1c1f2a', borderColor: '#313540', color: '#dfe2f1', borderRadius: '8px' }}
                    formatter={(val, name, item) => [
                      `${formatRupiah(val)} (${item?.payload?.share_pct}%)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-[#949db2] font-semibold">TOTAL ASET</span>
                <span className="text-sm font-bold text-white font-mono">100%</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="flex flex-col gap-2 pt-2">
              {brandDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#12151d] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brandColors[idx % brandColors.length] }}></span>
                    <span className="text-white font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#4cd7f6]">{item.share_pct}%</span>
                    <span className="text-[10px] text-[#949db2] block font-mono">{formatRupiah(item.value_rp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts Card */}
          <div className="bg-[#161922] p-5 rounded-xl border border-white/5 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Aksi Cepat Logistik</h3>
            <button
              onClick={onOpenTransfer}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[#12151d] hover:bg-[#202430] border border-white/5 transition-all text-xs font-semibold text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">local_shipping</span>
                <span>Muat Stok ke Mobil Kanvaser</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#949db2]">chevron_right</span>
            </button>
            <button
              onClick={onOpenNewPO}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[#12151d] hover:bg-[#202430] border border-white/5 transition-all text-xs font-semibold text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8083ff] text-[18px]">add_shopping_cart</span>
                <span>Terbitkan PO ke Pabrikan</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#949db2]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
