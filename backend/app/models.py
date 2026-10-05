import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    manufacturer = Column(String(100), nullable=False) # PT Gudang Garam Tbk, PT HM Sampoerna, PT Djarum, etc.
    golongan = Column(String(20), default="SKM") # SKM, SKT, SPM
    isi_batang = Column(Integer, default=16) # 12, 16, 20 batang
    cukai_year = Column(Integer, default=2026)
    
    # Packaging Hierarchy (Konversi Satuan Bertingkat)
    bungkus_per_slop = Column(Integer, default=10) # 1 Slop = 10 Bungkus
    slop_per_bal = Column(Integer, default=10)     # 1 Bal = 10 Slop = 100 Bungkus
    slop_per_karton = Column(Integer, default=80)  # 1 Karton = 80 Slop = 800 Bungkus (atau 40 slop)
    
    # Harga dalam Rupiah (IDR)
    hje_per_bungkus = Column(Float, default=0.0)      # Harga Jual Eceran Bandrol Cukai
    harga_beli_karton = Column(Float, default=0.0)    # Modal Beli dari Pabrik
    harga_jual_karton = Column(Float, default=0.0)    # Jual ke Agen/Grosir Besar
    harga_jual_slop = Column(Float, default=0.0)      # Jual ke Toko Kelontong
    harga_jual_bungkus = Column(Float, default=0.0)   # Harga Eceran Warung
    
    safety_stock_bungkus = Column(Integer, default=1600) # Ambang ROP (Reorder Point)
    
    stock_items = relationship("StockInventory", back_populates="product", cascade="all, delete-orphan")
    ledger_entries = relationship("StockLedger", back_populates="product")

class WarehouseLocation(Base):
    __tablename__ = "warehouse_locations"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(30), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    location_type = Column(String(30), default="GUDANG_PUSAT") # GUDANG_PUSAT, SUB_DEPO, VAN_KANVASER
    address = Column(String(200), nullable=True)
    pic_name = Column(String(80), nullable=True)
    phone = Column(String(30), nullable=True)
    vehicle_plate = Column(String(20), nullable=True) # Untuk mobil kanvaser (contoh: L 9842 AB)

    stocks = relationship("StockInventory", back_populates="location", cascade="all, delete-orphan")
    ledger_entries = relationship("StockLedger", back_populates="location")

class StockInventory(Base):
    __tablename__ = "stock_inventories"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("warehouse_locations.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity_bungkus = Column(Integer, default=0) # Base Unit: Bungkus

    location = relationship("WarehouseLocation", back_populates="stocks")
    product = relationship("Product", back_populates="stock_items")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String(50), unique=True, index=True, nullable=False)
    supplier_name = Column(String(100), nullable=False) # Pabrik Rokok
    order_date = Column(DateTime, default=datetime.datetime.utcnow)
    target_warehouse_id = Column(Integer, ForeignKey("warehouse_locations.id"), nullable=False)
    status = Column(String(30), default="DRAFT") # DRAFT, DISETUJUI, DALAM_PENGIRIMAN, SELESAI
    total_nilai_rp = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)

    items = relationship("PurchaseOrderItem", back_populates="purchase_order", cascade="all, delete-orphan")
    target_warehouse = relationship("WarehouseLocation")

class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity_karton = Column(Integer, default=0)
    harga_karton_rp = Column(Float, default=0.0)
    subtotal_rp = Column(Float, default=0.0)

    purchase_order = relationship("PurchaseOrder", back_populates="items")
    product = relationship("Product")

class SalesOrder(Base):
    __tablename__ = "sales_orders"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_name = Column(String(120), nullable=False) # Toko Kelontong / Grosir
    customer_phone = Column(String(30), nullable=True)
    customer_address = Column(String(200), nullable=True)
    source_location_id = Column(Integer, ForeignKey("warehouse_locations.id"), nullable=False)
    order_date = Column(DateTime, default=datetime.datetime.utcnow)
    due_date = Column(DateTime, nullable=True) # Jatuh tempo pembayaran
    payment_term = Column(String(30), default="COD") # COD, TEMPO_7_HARI, TEMPO_14_HARI
    total_nilai_rp = Column(Float, default=0.0)
    terbayar_rp = Column(Float, default=0.0)
    sisa_piutang_rp = Column(Float, default=0.0)
    status = Column(String(30), default="BELUM_LUNAS") # LUNAS, BELUM_LUNAS, OVERDUE

    items = relationship("SalesOrderItem", back_populates="sales_order", cascade="all, delete-orphan")
    source_location = relationship("WarehouseLocation")

class SalesOrderItem(Base):
    __tablename__ = "sales_order_items"

    id = Column(Integer, primary_key=True, index=True)
    sales_order_id = Column(Integer, ForeignKey("sales_orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    satuan_jual = Column(String(20), default="SLOP") # KARTON, BAL, SLOP, BUNGKUS
    quantity = Column(Integer, default=0)
    equivalent_bungkus = Column(Integer, default=0)
    harga_satuan_rp = Column(Float, default=0.0)
    subtotal_rp = Column(Float, default=0.0)

    sales_order = relationship("SalesOrder", back_populates="items")
    product = relationship("Product")

class StockLedger(Base):
    """
    Buku Besar Mutasi Stok Permanen (Immutable Audit Trail)
    Setiap penambahan atau pengurangan rokok dicatat detail di sini.
    """
    __tablename__ = "stock_ledgers"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    location_id = Column(Integer, ForeignKey("warehouse_locations.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    tx_type = Column(String(40), nullable=False) # INBOUND_PABRIK, OUTBOUND_KANVAS, MUTASI_ANTAR_DEPO, OPNAME_ADJUSTMENT, RETUR
    reference_number = Column(String(60), nullable=True) # PO No, Invoice No, Opname ID
    delta_bungkus = Column(Integer, nullable=False) # Positif (+) masuk, Negatif (-) keluar
    final_stock_bungkus = Column(Integer, nullable=False)
    operator_name = Column(String(80), default="System")
    notes = Column(String(255), nullable=True)

    location = relationship("WarehouseLocation", back_populates="ledger_entries")
    product = relationship("Product", back_populates="ledger_entries")
