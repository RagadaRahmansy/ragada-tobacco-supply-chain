from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

# Product Schemas
class ProductBase(BaseModel):
    sku: str
    name: str
    manufacturer: str
    golongan: str = "SKM"
    isi_batang: int = 16
    cukai_year: int = 2026
    bungkus_per_slop: int = 10
    slop_per_bal: int = 10
    slop_per_karton: int = 80
    hje_per_bungkus: float
    harga_beli_karton: float
    harga_jual_karton: float
    harga_jual_slop: float
    harga_jual_bungkus: float
    safety_stock_bungkus: int = 1600

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

# Warehouse / Depo Schemas
class WarehouseBase(BaseModel):
    code: str
    name: str
    location_type: str = "GUDANG_PUSAT"
    address: Optional[str] = None
    pic_name: Optional[str] = None
    phone: Optional[str] = None
    vehicle_plate: Optional[str] = None

class WarehouseCreate(WarehouseBase):
    pass

class WarehouseResponse(WarehouseBase):
    id: int

    class Config:
        from_attributes = True

# Stock Breakdown
class StockItemDetail(BaseModel):
    id: int
    product_id: int
    sku: str
    product_name: str
    manufacturer: str
    golongan: str
    cukai_year: int
    location_id: int
    location_name: str
    location_type: str
    vehicle_plate: Optional[str] = None
    quantity_bungkus: int
    # Calculated Units
    total_karton: float
    total_bal: float
    total_slop: float
    sisa_bungkus: int
    nilai_aset_rp: float
    hje_per_bungkus: float
    harga_jual_slop: float
    safety_stock_bungkus: int
    is_low_stock: bool

# Purchase Order (PO Pabrikan)
class POItemCreate(BaseModel):
    product_id: int
    quantity_karton: int
    harga_karton_rp: float

class POCreate(BaseModel):
    supplier_name: str
    target_warehouse_id: int
    notes: Optional[str] = None
    items: List[POItemCreate]

class POItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    sku: str
    quantity_karton: int
    harga_karton_rp: float
    subtotal_rp: float

class POResponse(BaseModel):
    id: int
    po_number: str
    supplier_name: str
    order_date: datetime
    target_warehouse_id: int
    target_warehouse_name: str
    status: str
    total_nilai_rp: float
    notes: Optional[str] = None
    items: List[POItemResponse]

    class Config:
        from_attributes = True

# Sales Order (Penjualan Kanvaser / Toko)
class SalesItemCreate(BaseModel):
    product_id: int
    satuan_jual: str = "SLOP" # KARTON, BAL, SLOP, BUNGKUS
    quantity: int
    harga_satuan_rp: float

class SalesCreate(BaseModel):
    customer_name: str
    customer_phone: Optional[str] = None
    customer_address: Optional[str] = None
    source_location_id: int
    payment_term: str = "COD" # COD, TEMPO_7_HARI, TEMPO_14_HARI
    terbayar_rp: float = 0.0
    items: List[SalesItemCreate]

class SalesItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    satuan_jual: str
    quantity: int
    equivalent_bungkus: int
    harga_satuan_rp: float
    subtotal_rp: float

class SalesResponse(BaseModel):
    id: int
    invoice_number: str
    customer_name: str
    customer_phone: Optional[str] = None
    customer_address: Optional[str] = None
    source_location_id: int
    source_location_name: str
    order_date: datetime
    due_date: Optional[datetime] = None
    payment_term: str
    total_nilai_rp: float
    terbayar_rp: float
    sisa_piutang_rp: float
    status: str
    items: List[SalesItemResponse]

    class Config:
        from_attributes = True

class PaymentUpdate(BaseModel):
    bayar_rp: float

# Stock Transfer & Opname
class StockTransferRequest(BaseModel):
    source_location_id: int
    destination_location_id: int
    product_id: int
    satuan: str = "KARTON" # KARTON, BAL, SLOP, BUNGKUS
    quantity: int
    operator_name: str = "Logistics Admin"
    notes: Optional[str] = None

class StockOpnameRequest(BaseModel):
    location_id: int
    product_id: int
    physical_count_bungkus: int
    operator_name: str = "Auditor Gudang"
    notes: Optional[str] = None

# Ledger Audit Response
class StockLedgerResponse(BaseModel):
    id: int
    timestamp: datetime
    location_name: str
    product_name: str
    sku: str
    tx_type: str
    reference_number: Optional[str] = None
    delta_bungkus: int
    final_stock_bungkus: int
    operator_name: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True

# Executive Overview Metrics
class OverviewMetricsResponse(BaseModel):
    total_nilai_aset_rp: float
    total_karton_equivalent: float
    total_slop_equivalent: float
    total_bungkus_inventory: int
    total_piutang_berjalan_rp: float
    total_piutang_overdue_rp: float
    total_omset_bulan_ini_rp: float
    low_stock_count: int
    total_warehouses: int
    total_vans: int
