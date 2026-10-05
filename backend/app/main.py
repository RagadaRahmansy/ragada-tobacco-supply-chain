import os
import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from .database import engine, Base, get_db
from .models import Product, WarehouseLocation, StockInventory, PurchaseOrder, PurchaseOrderItem, SalesOrder, SalesOrderItem, StockLedger
from .schemas import (
    ProductResponse, WarehouseResponse, StockItemDetail,
    POCreate, POResponse,
    SalesCreate, SalesResponse, PaymentUpdate,
    StockTransferRequest, StockOpnameRequest, StockLedgerResponse,
    OverviewMetricsResponse
)
from .seed_data import seed_database

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Ragada Tobacco SupplyChain OS API",
    description="Enterprise Multi-Echelon Cigarette Distribution & Logistics Management System",
    version="2.4.0"
)

# Enable CORS for Frontend Dev Server and Local Ports
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Seed Event
@app.on_event("startup")
def on_startup():
    db = next(get_db())
    try:
        seed_database(db)
    finally:
        db.close()

# 1. Healthcheck
@app.get("/api/health")
def healthcheck():
    return {
        "status": "healthy",
        "service": "Ragada Tobacco SupplyChain Backend",
        "currency": "IDR (Indonesian Rupiah)",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

# 2. Executive Overview Metrics (Styled like Dynamic SaaS)
@app.get("/api/overview")
def get_overview_metrics(db: Session = Depends(get_db)):
    stocks = db.query(StockInventory).all()
    
    total_bungkus = sum(s.quantity_bungkus for s in stocks)
    total_karton = sum(s.quantity_bungkus / (s.product.slop_per_karton * s.product.bungkus_per_slop) for s in stocks)
    total_slop = sum(s.quantity_bungkus / s.product.bungkus_per_slop for s in stocks)
    
    # Nilai Aset Stok = Total Karton * Harga Beli Modal Pabrik
    total_nilai_aset_rp = sum(
        (s.quantity_bungkus / (s.product.slop_per_karton * s.product.bungkus_per_slop)) * s.product.harga_beli_karton
        for s in stocks
    )
    
    # Piutang Toko Kelontong
    sales = db.query(SalesOrder).all()
    total_piutang_berjalan_rp = sum(so.sisa_piutang_rp for so in sales if so.status in ["BELUM_LUNAS", "OVERDUE"])
    total_piutang_overdue_rp = sum(so.sisa_piutang_rp for so in sales if so.status == "OVERDUE")
    total_omset_rp = sum(so.total_nilai_rp for so in sales)
    
    # Low stock alert
    low_stock_count = 0
    for s in stocks:
        if s.quantity_bungkus <= s.product.safety_stock_bungkus:
            low_stock_count += 1
            
    wh_count = db.query(WarehouseLocation).filter(WarehouseLocation.location_type != "VAN_KANVASER").count()
    van_count = db.query(WarehouseLocation).filter(WarehouseLocation.location_type == "VAN_KANVASER").count()
    
    # Trend Chart Data (Bulanan) untuk Dual-Axis ComposedChart
    trend_data = [
        {"period": "Mei", "omset_juta": 1420.0, "volume_karton": 1150},
        {"period": "Jun", "omset_juta": 1580.0, "volume_karton": 1280},
        {"period": "Jul", "omset_juta": 1690.0, "volume_karton": 1340},
        {"period": "Ags", "omset_juta": 1840.0, "volume_karton": 1460},
        {"period": "Sep", "omset_juta": 2120.0, "volume_karton": 1680},
        {"period": "Okt (Est)", "omset_juta": 2350.0, "volume_karton": 1850}
    ]
    
    # Distribusi Stok per Pabrikan (Donut Chart)
    brand_distribution = {}
    for s in stocks:
        mfg = s.product.manufacturer
        val = (s.quantity_bungkus / (s.product.slop_per_karton * s.product.bungkus_per_slop)) * s.product.harga_beli_karton
        brand_distribution[mfg] = brand_distribution.get(mfg, 0.0) + val
        
    donut_brands = [
        {"name": k.replace("PT ", "").replace(" Tbk", ""), "value_rp": v, "share_pct": round((v / max(1, total_nilai_aset_rp)) * 100, 1)}
        for k, v in brand_distribution.items()
    ]
    
    # Rekomendasi Alur Bisnis Cerdas (AI Supply Insights)
    insights = [
        {
            "title": "Percepatan Reorder Surya 16",
            "description": "Permintaan Gudang Garam Surya 16 di Van Kanvaser 01 meningkat 28%. Stok tersisa 5 karton (ambang batas 3 hari). Segera lakukan transfer dari Gudang Induk.",
            "type": "warning"
        },
        {
            "title": "Mitigasi Piutang Overdue Toko",
            "description": "Toko Rejeki Agung (Gresik) memiliki piutang jatuh tempo Rp 6.750.000 (>14 hari). Rekomendasi: Terapkan sistem COD pada pengiriman rute berikutnya.",
            "type": "alert"
        },
        {
            "title": "Konfirmasi Tronton PO Gudang Garam",
            "description": "PO-GG-202610-001 (50 Karton / Rp 1,23 Milyar) dijadwalkan masuk dermaga bongkar Gudang Surabaya esok pukul 08:30 WIB.",
            "type": "info"
        }
    ]

    return {
        "kpi": {
            "total_nilai_aset_rp": total_nilai_aset_rp,
            "total_karton_equivalent": round(total_karton, 1),
            "total_slop_equivalent": round(total_slop, 1),
            "total_bungkus_inventory": total_bungkus,
            "total_piutang_berjalan_rp": total_piutang_berjalan_rp,
            "total_piutang_overdue_rp": total_piutang_overdue_rp,
            "total_omset_bulan_ini_rp": total_omset_rp,
            "low_stock_count": low_stock_count,
            "total_warehouses": wh_count,
            "total_vans": van_count
        },
        "trend_data": trend_data,
        "brand_distribution": donut_brands,
        "insights": insights
    }

# 3. Master Data Endpoints
@app.get("/api/products", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@app.get("/api/warehouses", response_model=List[WarehouseResponse])
def get_warehouses(db: Session = Depends(get_db)):
    return db.query(WarehouseLocation).all()

# 4. Multi-UoM Inventory Endpoints
@app.get("/api/inventory", response_model=List[StockItemDetail])
def get_inventory(
    location_id: Optional[int] = None,
    search: Optional[str] = None,
    low_stock_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(StockInventory).join(Product).join(WarehouseLocation)
    
    if location_id:
        query = query.filter(StockInventory.location_id == location_id)
        
    if search:
        search_fmt = f"%{search}%"
        query = query.filter((Product.name.ilike(search_fmt)) | (Product.sku.ilike(search_fmt)))
        
    stocks = query.all()
    result = []
    
    for s in stocks:
        bks = s.quantity_bungkus
        bks_per_slop = s.product.bungkus_per_slop or 10
        slop_per_bal = s.product.slop_per_bal or 10
        slop_per_karton = s.product.slop_per_karton or 80
        
        bks_per_karton = slop_per_karton * bks_per_slop
        bks_per_bal = slop_per_bal * bks_per_slop
        
        tot_karton = bks / bks_per_karton
        tot_bal = bks / bks_per_bal
        tot_slop = bks / bks_per_slop
        sisa_bks = bks % bks_per_slop
        
        nilai_aset = tot_karton * s.product.harga_beli_karton
        is_low = bks <= s.product.safety_stock_bungkus
        
        if low_stock_only and not is_low:
            continue
            
        result.append(StockItemDetail(
            id=s.id,
            product_id=s.product_id,
            sku=s.product.sku,
            product_name=s.product.name,
            manufacturer=s.product.manufacturer,
            golongan=s.product.golongan,
            cukai_year=s.product.cukai_year,
            location_id=s.location_id,
            location_name=s.location.name,
            location_type=s.location.location_type,
            vehicle_plate=s.location.vehicle_plate,
            quantity_bungkus=bks,
            total_karton=round(tot_karton, 2),
            total_bal=round(tot_bal, 2),
            total_slop=round(tot_slop, 1),
            sisa_bungkus=sisa_bks,
            nilai_aset_rp=round(nilai_aset, 2),
            hje_per_bungkus=s.product.hje_per_bungkus,
            harga_jual_slop=s.product.harga_jual_slop,
            safety_stock_bungkus=s.product.safety_stock_bungkus,
            is_low_stock=is_low
        ))
        
    return result

# 5. Purchase Order (PO Pabrikan) Endpoints
@app.get("/api/procurement")
def get_purchase_orders(db: Session = Depends(get_db)):
    pos = db.query(PurchaseOrder).order_by(PurchaseOrder.order_date.desc()).all()
    results = []
    for po in pos:
        items = []
        for itm in po.items:
            items.append({
                "id": itm.id,
                "product_id": itm.product_id,
                "product_name": itm.product.name,
                "sku": itm.product.sku,
                "quantity_karton": itm.quantity_karton,
                "harga_karton_rp": itm.harga_karton_rp,
                "subtotal_rp": itm.subtotal_rp
            })
        results.append({
            "id": po.id,
            "po_number": po.po_number,
            "supplier_name": po.supplier_name,
            "order_date": po.order_date,
            "target_warehouse_id": po.target_warehouse_id,
            "target_warehouse_name": po.target_warehouse.name,
            "status": po.status,
            "total_nilai_rp": po.total_nilai_rp,
            "notes": po.notes,
            "items": items
        })
    return results

@app.post("/api/procurement")
def create_purchase_order(po_in: POCreate, db: Session = Depends(get_db)):
    po_count = db.query(PurchaseOrder).count() + 1
    today_str = datetime.datetime.utcnow().strftime("%Y%m")
    po_num = f"PO-PABRIK-{today_str}-{po_count:03d}"
    
    total_rp = sum(i.quantity_karton * i.harga_karton_rp for i in po_in.items)
    
    new_po = PurchaseOrder(
        po_number=po_num,
        supplier_name=po_in.supplier_name,
        target_warehouse_id=po_in.target_warehouse_id,
        status="DALAM_PENGIRIMAN",
        total_nilai_rp=total_rp,
        notes=po_in.notes or "PO baru diterbitkan ke pabrik rokok."
    )
    db.add(new_po)
    db.commit()
    
    for itm in po_in.items:
        sub = itm.quantity_karton * itm.harga_karton_rp
        p_item = PurchaseOrderItem(
            po_id=new_po.id,
            product_id=itm.product_id,
            quantity_karton=itm.quantity_karton,
            harga_karton_rp=itm.harga_karton_rp,
            subtotal_rp=sub
        )
        db.add(p_item)
    db.commit()
    
    return {"message": "Purchase Order berhasil diterbitkan", "po_number": po_num, "id": new_po.id}

@app.put("/api/procurement/{po_id}/receive")
def receive_purchase_order(po_id: int, operator_name: str = "Kepala Gudang", db: Session = Depends(get_db)):
    po = db.query(PurchaseOrder).get(po_id)
    if not po:
        raise HTTPException(status_code=404, detail="Purchase Order tidak ditemukan")
    if po.status == "SELESAI":
        raise HTTPException(status_code=400, detail="PO ini sudah diterima sebelumnya")
        
    po.status = "SELESAI"
    
    # Tambah stok fisik ke gudang tujuan
    for itm in po.items:
        prd = itm.product
        qty_bks = itm.quantity_karton * prd.slop_per_karton * prd.bungkus_per_slop
        
        stk = db.query(StockInventory).filter_by(
            location_id=po.target_warehouse_id,
            product_id=itm.product_id
        ).first()
        
        if not stk:
            stk = StockInventory(
                location_id=po.target_warehouse_id,
                product_id=itm.product_id,
                quantity_bungkus=0
            )
            db.add(stk)
            
        stk.quantity_bungkus += qty_bks
        
        # Catat Audit Ledger
        ledger = StockLedger(
            timestamp=datetime.datetime.utcnow(),
            location_id=po.target_warehouse_id,
            product_id=itm.product_id,
            tx_type="INBOUND_PABRIK",
            reference_number=po.po_number,
            delta_bungkus=qty_bks,
            final_stock_bungkus=stk.quantity_bungkus,
            operator_name=operator_name,
            notes=f"Penerimaan {itm.quantity_karton} Karton dari {po.supplier_name}"
        )
        db.add(ledger)
        
    db.commit()
    return {"message": f"Barang PO {po.po_number} berhasil diterima dan dicatat ke audit ledger"}

# 6. Sales Order & Piutang Toko Endpoints
@app.get("/api/sales")
def get_sales_orders(db: Session = Depends(get_db)):
    orders = db.query(SalesOrder).order_by(SalesOrder.order_date.desc()).all()
    results = []
    for so in orders:
        items = []
        for itm in so.items:
            items.append({
                "id": itm.id,
                "product_id": itm.product_id,
                "product_name": itm.product.name,
                "satuan_jual": itm.satuan_jual,
                "quantity": itm.quantity,
                "equivalent_bungkus": itm.equivalent_bungkus,
                "harga_satuan_rp": itm.harga_satuan_rp,
                "subtotal_rp": itm.subtotal_rp
            })
        results.append({
            "id": so.id,
            "invoice_number": so.invoice_number,
            "customer_name": so.customer_name,
            "customer_phone": so.customer_phone,
            "customer_address": so.customer_address,
            "source_location_id": so.source_location_id,
            "source_location_name": so.source_location.name,
            "order_date": so.order_date,
            "due_date": so.due_date,
            "payment_term": so.payment_term,
            "total_nilai_rp": so.total_nilai_rp,
            "terbayar_rp": so.terbayar_rp,
            "sisa_piutang_rp": so.sisa_piutang_rp,
            "status": so.status,
            "items": items
        })
    return results

@app.post("/api/sales")
def create_sales_order(sales_in: SalesCreate, db: Session = Depends(get_db)):
    today_str = datetime.datetime.utcnow().strftime("%Y%m")
    inv_count = db.query(SalesOrder).count() + 1
    inv_num = f"INV-{today_str}-{inv_count:03d}"
    
    now = datetime.datetime.utcnow()
    due = now
    if sales_in.payment_term == "TEMPO_7_HARI":
        due = now + datetime.timedelta(days=7)
    elif sales_in.payment_term == "TEMPO_14_HARI":
        due = now + datetime.timedelta(days=14)
        
    total_val = sum(itm.quantity * itm.harga_satuan_rp for itm in sales_in.items)
    sisa = max(0.0, total_val - sales_in.terbayar_rp)
    stat = "LUNAS" if sisa == 0 else "BELUM_LUNAS"
    
    new_so = SalesOrder(
        invoice_number=inv_num,
        customer_name=sales_in.customer_name,
        customer_phone=sales_in.customer_phone,
        customer_address=sales_in.customer_address,
        source_location_id=sales_in.source_location_id,
        order_date=now,
        due_date=due,
        payment_term=sales_in.payment_term,
        total_nilai_rp=total_val,
        terbayar_rp=sales_in.terbayar_rp,
        sisa_piutang_rp=sisa,
        status=stat
    )
    db.add(new_so)
    db.commit()
    
    for itm in sales_in.items:
        prd = db.query(Product).get(itm.product_id)
        # Hitung equivalent bungkus
        if itm.satuan_jual == "KARTON":
            eq_bks = itm.quantity * prd.slop_per_karton * prd.bungkus_per_slop
        elif itm.satuan_jual == "BAL":
            eq_bks = itm.quantity * prd.slop_per_bal * prd.bungkus_per_slop
        elif itm.satuan_jual == "SLOP":
            eq_bks = itm.quantity * prd.bungkus_per_slop
        else: # BUNGKUS
            eq_bks = itm.quantity
            
        sub = itm.quantity * itm.harga_satuan_rp
        so_item = SalesOrderItem(
            sales_order_id=new_so.id,
            product_id=itm.product_id,
            satuan_jual=itm.satuan_jual,
            quantity=itm.quantity,
            equivalent_bungkus=eq_bks,
            harga_satuan_rp=itm.harga_satuan_rp,
            subtotal_rp=sub
        )
        db.add(so_item)
        
        # Kurangi stok fisik di gudang/mobil kanvaser
        stk = db.query(StockInventory).filter_by(
            location_id=sales_in.source_location_id,
            product_id=itm.product_id
        ).first()
        
        if stk:
            stk.quantity_bungkus = max(0, stk.quantity_bungkus - eq_bks)
            final_bks = stk.quantity_bungkus
        else:
            final_bks = 0
            
        # Catat Audit Ledger
        ledger = StockLedger(
            timestamp=datetime.datetime.utcnow(),
            location_id=sales_in.source_location_id,
            product_id=itm.product_id,
            tx_type="OUTBOUND_KANVAS",
            reference_number=inv_num,
            delta_bungkus=-eq_bks,
            final_stock_bungkus=final_bks,
            operator_name="Sales Kanvaser",
            notes=f"Penjualan {itm.quantity} {itm.satuan_jual} ke {sales_in.customer_name}"
        )
        db.add(ledger)
        
    db.commit()
    return {"message": "Faktur penjualan berhasil dibuat", "invoice_number": inv_num, "id": new_so.id}

@app.put("/api/sales/{sales_id}/pay")
def pay_sales_order(sales_id: int, pay_data: PaymentUpdate, db: Session = Depends(get_db)):
    so = db.query(SalesOrder).get(sales_id)
    if not so:
        raise HTTPException(status_code=404, detail="Faktur tidak ditemukan")
        
    so.terbayar_rp += pay_data.bayar_rp
    so.sisa_piutang_rp = max(0.0, so.total_nilai_rp - so.terbayar_rp)
    
    if so.sisa_piutang_rp == 0:
        so.status = "LUNAS"
    else:
        so.status = "BELUM_LUNAS"
        
    db.commit()
    return {"message": "Pembayaran piutang berhasil dicatat", "sisa_piutang_rp": so.sisa_piutang_rp, "status": so.status}

# 7. Stock Transfer & Daily Stock Opname
@app.post("/api/inventory/transfer")
def transfer_stock(req: StockTransferRequest, db: Session = Depends(get_db)):
    prd = db.query(Product).get(req.product_id)
    if not prd:
        raise HTTPException(status_code=404, detail="Produk tidak ditemukan")
        
    # Hitung bungkus
    if req.satuan == "KARTON":
        qty_bks = req.quantity * prd.slop_per_karton * prd.bungkus_per_slop
    elif req.satuan == "BAL":
        qty_bks = req.quantity * prd.slop_per_bal * prd.bungkus_per_slop
    elif req.satuan == "SLOP":
        qty_bks = req.quantity * prd.bungkus_per_slop
    else:
        qty_bks = req.quantity
        
    source_stk = db.query(StockInventory).filter_by(
        location_id=req.source_location_id,
        product_id=req.product_id
    ).first()
    
    if not source_stk or source_stk.quantity_bungkus < qty_bks:
        raise HTTPException(status_code=400, detail="Stok di lokasi asal tidak mencukupi untuk transfer")
        
    dest_stk = db.query(StockInventory).filter_by(
        location_id=req.destination_location_id,
        product_id=req.product_id
    ).first()
    
    if not dest_stk:
        dest_stk = StockInventory(
            location_id=req.destination_location_id,
            product_id=req.product_id,
            quantity_bungkus=0
        )
        db.add(dest_stk)
        
    source_stk.quantity_bungkus -= qty_bks
    dest_stk.quantity_bungkus += qty_bks
    
    transfer_ref = f"TRF-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M')}"
    
    # 2 Ledger entries (Source - dan Dest +)
    led_src = StockLedger(
        timestamp=datetime.datetime.utcnow(),
        location_id=req.source_location_id,
        product_id=req.product_id,
        tx_type="MUTASI_ANTAR_DEPO",
        reference_number=transfer_ref,
        delta_bungkus=-qty_bks,
        final_stock_bungkus=source_stk.quantity_bungkus,
        operator_name=req.operator_name,
        notes=f"Kirim {req.quantity} {req.satuan} ke {dest_stk.location.name}"
    )
    led_dest = StockLedger(
        timestamp=datetime.datetime.utcnow(),
        location_id=req.destination_location_id,
        product_id=req.product_id,
        tx_type="MUTASI_ANTAR_DEPO",
        reference_number=transfer_ref,
        delta_bungkus=qty_bks,
        final_stock_bungkus=dest_stk.quantity_bungkus,
        operator_name=req.operator_name,
        notes=f"Terima {req.quantity} {req.satuan} dari {source_stk.location.name}"
    )
    db.add_all([led_src, led_dest])
    db.commit()
    
    return {"message": "Transfer stok fisik berhasil dicatat", "transfer_ref": transfer_ref}

@app.post("/api/inventory/opname")
def stock_opname_adjustment(req: StockOpnameRequest, db: Session = Depends(get_db)):
    stk = db.query(StockInventory).filter_by(
        location_id=req.location_id,
        product_id=req.product_id
    ).first()
    
    if not stk:
        stk = StockInventory(
            location_id=req.location_id,
            product_id=req.product_id,
            quantity_bungkus=0
        )
        db.add(stk)
        
    system_bks = stk.quantity_bungkus
    delta = req.physical_count_bungkus - system_bks
    stk.quantity_bungkus = req.physical_count_bungkus
    
    opname_ref = f"OPN-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M')}"
    
    ledger = StockLedger(
        timestamp=datetime.datetime.utcnow(),
        location_id=req.location_id,
        product_id=req.product_id,
        tx_type="OPNAME_ADJUSTMENT",
        reference_number=opname_ref,
        delta_bungkus=delta,
        final_stock_bungkus=req.physical_count_bungkus,
        operator_name=req.operator_name,
        notes=f"Audit Opname: Sistem={system_bks}, Fisik={req.physical_count_bungkus} (Selisih {delta:+} bks). {req.notes or ''}"
    )
    db.add(ledger)
    db.commit()
    
    return {
        "message": "Hasil Stock Opname berhasil disinkronisasi",
        "opname_ref": opname_ref,
        "delta_bungkus": delta,
        "final_stock_bungkus": req.physical_count_bungkus
    }

# 8. Immutable Audit Ledger
@app.get("/api/audit/ledger")
def get_stock_ledger(limit: int = 50, db: Session = Depends(get_db)):
    entries = db.query(StockLedger).order_by(StockLedger.timestamp.desc()).limit(limit).all()
    results = []
    for e in entries:
        results.append({
            "id": e.id,
            "timestamp": e.timestamp,
            "location_name": e.location.name,
            "product_name": e.product.name,
            "sku": e.product.sku,
            "tx_type": e.tx_type,
            "reference_number": e.reference_number,
            "delta_bungkus": e.delta_bungkus,
            "final_stock_bungkus": e.final_stock_bungkus,
            "operator_name": e.operator_name,
            "notes": e.notes
        })
    return results
