import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Layout
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Views
import OverviewView from './components/overview/OverviewView';
import InventoryView from './components/inventory/InventoryView';
import ProcurementView from './components/procurement/ProcurementView';
import SalesCanvasView from './components/sales/SalesCanvasView';
import AuditLedgerView from './components/audit/AuditLedgerView';

// Modals
import TransferModal from './components/modals/TransferModal';
import OpnameModal from './components/modals/OpnameModal';
import NewPOModal from './components/modals/NewPOModal';
import NewSalesModal from './components/modals/NewSalesModal';
import PayModal from './components/modals/PayModal';

const API_BASE = window.location.port === '5176' ? '/api' : 'http://localhost:8002/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('');

  // Data State
  const [overviewData, setOverviewData] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [procurementOrders, setProcurementOrders] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);

  // Modals State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showOpnameModal, setShowOpnameModal] = useState(false);
  const [showNewPOModal, setShowNewPOModal] = useState(false);
  const [showNewSalesModal, setShowNewSalesModal] = useState(false);
  const [activePayOrder, setActivePayOrder] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [ovRes, invRes, whRes, prdRes, poRes, soRes, ledRes] = await Promise.all([
        axios.get(`${API_BASE}/overview`),
        axios.get(`${API_BASE}/inventory`),
        axios.get(`${API_BASE}/warehouses`),
        axios.get(`${API_BASE}/products`),
        axios.get(`${API_BASE}/procurement`),
        axios.get(`${API_BASE}/sales`),
        axios.get(`${API_BASE}/audit/ledger?limit=100`)
      ]);

      setOverviewData(ovRes.data);
      setInventory(invRes.data);
      setWarehouses(whRes.data);
      setProducts(prdRes.data);
      setProcurementOrders(poRes.data);
      setSalesOrders(soRes.data);
      setLedgerEntries(ledRes.data);
    } catch (err) {
      console.error("Gagal memuat data dari FastAPI:", err);
      showToast("Gagal terhubung ke backend FastAPI port 8002", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Modal Action Handlers
  const handleTransferSubmit = async (payload) => {
    try {
      await axios.post(`${API_BASE}/inventory/transfer`, payload);
      showToast("Transfer stok antar-depo / muat kanvaser berhasil dicatat!");
      setShowTransferModal(false);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.detail || "Gagal transfer stok", "error");
    }
  };

  const handleOpnameSubmit = async (payload) => {
    try {
      await axios.post(`${API_BASE}/inventory/opname`, payload);
      showToast("Hasil Stock Opname fisik berhasil disinkronisasi ke audit ledger!");
      setShowOpnameModal(false);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.detail || "Gagal simpan opname", "error");
    }
  };

  const handlePOSubmit = async (payload) => {
    try {
      await axios.post(`${API_BASE}/procurement`, payload);
      showToast("Purchase Order baru ke pabrik rokok berhasil diterbitkan!");
      setShowNewPOModal(false);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.detail || "Gagal menerbitkan PO", "error");
    }
  };

  const handleReceivePO = async (poId) => {
    try {
      await axios.put(`${API_BASE}/procurement/${poId}/receive`);
      showToast("Penerimaan barang (GRN) dikonfirmasi. Stok fisik gudang bertambah!");
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.detail || "Gagal menerima PO", "error");
    }
  };

  const handleSalesSubmit = async (payload) => {
    try {
      await axios.post(`${API_BASE}/sales`, payload);
      showToast("Faktur toko kelontong baru berhasil dibuat & stok terpotong!");
      setShowNewSalesModal(false);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.detail || "Gagal membuat faktur", "error");
    }
  };

  const handlePaySubmit = async (salesId, bayarNominal) => {
    try {
      await axios.put(`${API_BASE}/sales/${salesId}/pay`, { bayar_rp: bayarNominal });
      showToast("Pembayaran piutang toko berhasil dicatat!");
      setActivePayOrder(null);
      fetchAllData();
    } catch (err) {
      showToast(err.response?.data?.detail || "Gagal catat pembayaran", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0e14] text-[#dfe2f1] font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-200 ${
          toast.type === 'error'
            ? 'bg-[#f43f5e] text-white border-white/20'
            : 'bg-[#10b981] text-white border-white/20'
        }`}>
          <span className="material-symbols-outlined text-[18px]">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          warehouses={warehouses}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onOpenTransfer={() => setShowTransferModal(true)}
          onOpenNewPO={() => setShowNewPOModal(true)}
          onOpenOpname={() => setShowOpnameModal(true)}
        />

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {loading && !overviewData ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[#8083ff] text-[40px] animate-spin">
                progress_activity
              </span>
              <span className="text-xs text-[#949db2] font-mono">Memuat telemetri logistik rokok...</span>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewView
                  overviewData={overviewData}
                  onOpenNewPO={() => setShowNewPOModal(true)}
                  onOpenTransfer={() => setShowTransferModal(true)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {activeTab === 'inventory' && (
                <InventoryView
                  inventory={inventory}
                  warehouses={warehouses}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  onOpenTransfer={() => setShowTransferModal(true)}
                  onOpenOpname={() => setShowOpnameModal(true)}
                />
              )}

              {activeTab === 'procurement' && (
                <ProcurementView
                  orders={procurementOrders}
                  onOpenNewPO={() => setShowNewPOModal(true)}
                  onReceivePO={handleReceivePO}
                />
              )}

              {activeTab === 'sales' && (
                <SalesCanvasView
                  orders={salesOrders}
                  onOpenNewSales={() => setShowNewSalesModal(true)}
                  onPaySales={(so) => setActivePayOrder(so)}
                />
              )}

              {activeTab === 'audit' && (
                <AuditLedgerView
                  ledger={ledgerEntries}
                  onOpenOpname={() => setShowOpnameModal(true)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        warehouses={warehouses}
        products={products}
        onSubmit={handleTransferSubmit}
      />

      <OpnameModal
        isOpen={showOpnameModal}
        onClose={() => setShowOpnameModal(false)}
        warehouses={warehouses}
        products={products}
        onSubmit={handleOpnameSubmit}
      />

      <NewPOModal
        isOpen={showNewPOModal}
        onClose={() => setShowNewPOModal(false)}
        warehouses={warehouses}
        products={products}
        onSubmit={handlePOSubmit}
      />

      <NewSalesModal
        isOpen={showNewSalesModal}
        onClose={() => setShowNewSalesModal(false)}
        warehouses={warehouses}
        products={products}
        onSubmit={handleSalesSubmit}
      />

      <PayModal
        isOpen={!!activePayOrder}
        onClose={() => setActivePayOrder(null)}
        salesOrder={activePayOrder}
        onSubmit={handlePaySubmit}
      />
    </div>
  );
}
