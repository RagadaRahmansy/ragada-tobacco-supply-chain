import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'overview', label: 'Executive Overview', icon: 'dashboard', badge: 'Realtime' },
    { id: 'inventory', label: 'Stok Multi-Gudang', icon: 'inventory_2', badge: null },
    { id: 'procurement', label: 'PO Pabrik Rokok', icon: 'factory', badge: 'Inbound' },
    { id: 'sales', label: 'Kanvas & Piutang Toko', icon: 'local_shipping', badge: 'Tempo' },
    { id: 'audit', label: 'Audit Mutasi & Opname', icon: 'verified_user', badge: 'Zero-Leak' },
  ];

  return (
    <aside className="w-64 bg-[#12151d] border-r border-white/5 flex flex-col justify-between h-screen sticky top-0 select-none z-30">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-white/5 gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#8083ff] to-[#4cd7f6] flex items-center justify-center shadow-lg shadow-[#8083ff]/20">
            <span className="material-symbols-outlined text-white text-[20px]">package_2</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm tracking-tight leading-none">RAGADA SUPPLY</span>
            <span className="text-[10px] text-[#4cd7f6] font-semibold tracking-wider uppercase mt-1">Tobacco Distribution</span>
          </div>
        </div>

        {/* Currency & Depo Status Strip */}
        <div className="mx-3 my-3 p-2.5 rounded-xl bg-[#161922] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="text-xs text-white/80 font-medium">Mata Uang</span>
          </div>
          <span className="text-xs font-mono font-bold text-[#10b981] px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/20">
            IDR (Rp)
          </span>
        </div>

        {/* Navigation List */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8083ff] text-white shadow-md shadow-[#8083ff]/25'
                    : 'text-[#949db2] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-white' : 'text-[#8083ff]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-black/25 text-white'
                        : 'bg-white/5 text-[#4cd7f6] border border-white/10'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User / Warehouse Admin Footer */}
      <div className="p-3 border-t border-white/5">
        <div className="p-3 rounded-xl bg-[#161922] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#8083ff]/20 border border-[#8083ff]/30 flex items-center justify-center text-[#8083ff] font-bold text-xs">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">Admin Logistik</span>
              <span className="text-[10px] text-[#949db2]">Hub Surabaya Pusat</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#949db2]">tune</span>
        </div>
      </div>
    </aside>
  );
}
