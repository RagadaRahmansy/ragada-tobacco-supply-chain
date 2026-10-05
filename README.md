# Ragada Tobacco SupplyChain OS

**Enterprise Multi-Echelon Cigarette Distribution & Logistics Management System (IDR)**

Ragada Tobacco SupplyChain OS adalah platform rantai pasok dan inventori modern yang dirancang khusus untuk memetakan dinamika distribusi industri rokok nasional di Indonesia dengan nilai mata uang Rupiah (IDR).

---

## 🌟 Fitur Utama

1. **Konversi Satuan Bertingkat (Multi-UoM Engine):**
   * Agregasi dan konversi otomatis dari satuan Pabrikan (**Karton / Dus**) ➔ Grosir (**Bal** / **Slop**) ➔ Toko Kelontong (**Bungkus** eceran) tanpa selisih hitung fisik.
2. **Executive Overview Cockpit (Gaya Dynamic SaaS):**
   * Telemetri total nilai aset gudang (Rp Milyar), volume karton, dan kurva Dual-Axis (*Omset vs Karton*).
   * Visualisasi Donut pangsa pasar pabrikan: PT Gudang Garam Tbk, PT HM Sampoerna Tbk, PT Djarum, dan PT Wismilak Inti Makmur.
3. **Pengadaan Pabrikan (Purchase Order):**
   * Alur pemesanan skala tronton/kontainer ke pabrik rokok dan verifikasi penerimaan fisik (*Goods Received Note - GRN*).
4. **Distribusi Kanvaser & Piutang Tempo (TOP):**
   * Manajemen stok mobil box kanvaser keliling ke warung kelontong/pasar dan penagihan piutang toko (COD, Tempo 7 Hari, 14 Hari).
5. **Buku Besar Mutasi Anti-Manipulasi (Immutable Audit Ledger):**
   * Pencatatan permanen setiap pergerakan bungkus rokok (+ / -) dengan timestamp dan ID operator guna memitigasi risiko kebocoran (*shrinkage*).
   * Modul *Daily Stock Opname* untuk audit fisik harian.

---

## 🏗️ Arsitektur & Teknologi

* **Frontend:** Vite + React 19 + Tailwind CSS + Lucide Icons + Recharts (Port 5176)
* **Backend:** FastAPI (Python 3.11 asinkron) + SQLAlchemy ORM (Port 8002)
* **Database:** SQLite Terisolasi (bebas biaya, siap migrasi ke PostgreSQL)
* **Keamanan:** Pydantic schema validation, zero third-party CDNs, dan kedaulatan data lokal 100%.

---

## 🚀 Panduan Menjalankan Sistem

### 1. Menjalankan Backend (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python run_backend.py
```
* Backend berjalan di: `http://localhost:8002`
* Dokumentasi API Swagger: `http://localhost:8002/docs`

### 2. Menjalankan Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
```
* Dashboard berjalan di: `http://localhost:5176`

---

## 📄 Lisensi
Hak Cipta © 2026 Ragada Analytics. Seluruh hak cipta dilindungi undang-undang.
