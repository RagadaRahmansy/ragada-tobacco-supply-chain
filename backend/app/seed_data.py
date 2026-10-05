import datetime
from sqlalchemy.orm import Session
from .models import Product, WarehouseLocation, StockInventory, PurchaseOrder, PurchaseOrderItem, SalesOrder, SalesOrderItem, StockLedger

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Product).first():
        return

    # 1. Seed Warehouse Locations (Gudang Induk, Sub-Depo, & Mobil Kanvaser)
    warehouses = [
        WarehouseLocation(
            code="WH-SUB-01",
            name="Gudang Induk Distribusi Surabaya",
            location_type="GUDANG_PUSAT",
            address="Kawasan Industri Rungkut Blok B-12, Surabaya",
            pic_name="Budi Santoso",
            phone="081234567890",
            vehicle_plate=None
        ),
        WarehouseLocation(
            code="WH-MLG-02",
            name="Sub-Depo Wilayah Malang Raya",
            location_type="SUB_DEPO",
            address="Jl. Raya Karanglo No. 45, Singosari, Malang",
            pic_name="Agus Prasetyo",
            phone="081398765432",
            vehicle_plate=None
        ),
        WarehouseLocation(
            code="WH-SDA-03",
            name="Sub-Depo Sidoarjo & Pasuruan",
            location_type="SUB_DEPO",
            address="Jl. Jenggolo No. 88, Gedangan, Sidoarjo",
            pic_name="Hendra Wijaya",
            phone="082145678901",
            vehicle_plate=None
        ),
        WarehouseLocation(
            code="VAN-01",
            name="Mobil Kanvaser 01 (Rute Surabaya Timur)",
            location_type="VAN_KANVASER",
            address="Area Operasional: Rungkut - Sukolilo - Kenjeran",
            pic_name="Rudi Hartono (Sales Driver)",
            phone="085712345678",
            vehicle_plate="L 9421 AB (Toyota Dyna Box)"
        ),
        WarehouseLocation(
            code="VAN-02",
            name="Mobil Kanvaser 02 (Rute Surabaya Barat & Gresik)",
            location_type="VAN_KANVASER",
            address="Area Operasional: Tandes - Benowo - Menganti",
            pic_name="Dedi Kurniawan (Sales Driver)",
            phone="085698765432",
            vehicle_plate="L 8812 XY (Isuzu Elf Box)"
        )
    ]
    db.add_all(warehouses)
    db.commit()

    # 2. Seed Master Data Produk Rokok Nasional (Harga Rupiah Standar Grosir & HJE)
    products = [
        Product(
            sku="SKU-GG-SURYA16",
            name="Gudang Garam Surya 16",
            manufacturer="PT Gudang Garam Tbk",
            golongan="SKM",
            isi_batang=16,
            cukai_year=2026,
            bungkus_per_slop=10,
            slop_per_bal=10,
            slop_per_karton=80, # 1 Karton = 800 Bungkus
            hje_per_bungkus=36000.0,
            harga_beli_karton=24640000.0,  # Rp 30.800 / bks modal pabrik
            harga_jual_karton=25600000.0,  # Rp 32.000 / bks grosir kartonan
            harga_jual_slop=330000.0,      # Rp 33.000 / bks jual ke warung per slop
            harga_jual_bungkus=35000.0,    # Eceran warung
            safety_stock_bungkus=3200      # 4 Karton
        ),
        Product(
            sku="SKU-GG-MERAH12",
            name="Gudang Garam Merah Kretek 12",
            manufacturer="PT Gudang Garam Tbk",
            golongan="SKT",
            isi_batang=12,
            cukai_year=2026,
            bungkus_per_slop=10,
            slop_per_bal=10,
            slop_per_karton=80,
            hje_per_bungkus=17000.0,
            harga_beli_karton=11200000.0,  # Rp 14.000 / bks
            harga_jual_karton=11840000.0,
            harga_jual_slop=152000.0,
            harga_jual_bungkus=16500.0,
            safety_stock_bungkus=2400
        ),
        Product(
            sku="SKU-SMP-AMILD16",
            name="Sampoerna A Mild 16",
            manufacturer="PT HM Sampoerna Tbk",
            golongan="SKM",
            isi_batang=16,
            cukai_year=2026,
            bungkus_per_slop=10,
            slop_per_bal=10,
            slop_per_karton=80,
            hje_per_bungkus=35500.0,
            harga_beli_karton=24000000.0,  # Rp 30.000 / bks
            harga_jual_karton=24960000.0,
            harga_jual_slop=325000.0,
            harga_jual_bungkus=34500.0,
            safety_stock_bungkus=3200
        ),
        Product(
            sku="SKU-SMP-234KRE",
            name="Dji Sam Soe 234 Kretek 12",
            manufacturer="PT HM Sampoerna Tbk",
            golongan="SKT",
            isi_batang=12,
            cukai_year=2026,
            bungkus_per_slop=10,
            slop_per_bal=10,
            slop_per_karton=80,
            hje_per_bungkus=21000.0,
            harga_beli_karton=14400000.0,  # Rp 18.000 / bks
            harga_jual_karton=15200000.0,
            harga_jual_slop=195000.0,
            harga_jual_bungkus=20500.0,
            safety_stock_bungkus=2400
        ),
        Product(
            sku="SKU-DJR-SUPER12",
            name="Djarum Super 12",
            manufacturer="PT Djarum",
            golongan="SKM",
            isi_batang=12,
            cukai_year=2026,
            bungkus_per_slop=10,
            slop_per_bal=10,
            slop_per_karton=80,
            hje_per_bungkus=25000.0,
            harga_beli_karton=16800000.0,  # Rp 21.000 / bks
            harga_jual_karton=17600000.0,
            harga_jual_slop=228000.0,
            harga_jual_bungkus=24000.0,
            safety_stock_bungkus=3200
        ),
        Product(
            sku="SKU-DJR-BLACK16",
            name="Djarum Black 16",
            manufacturer="PT Djarum",
            golongan="SKM",
            isi_batang=16,
            cukai_year=2026,
            bungkus_per_slop=10,
            slop_per_bal=10,
            slop_per_karton=80,
            hje_per_bungkus=33000.0,
            harga_beli_karton=22400000.0,
            harga_jual_karton=23200000.0,
            harga_jual_slop=300000.0,
            harga_jual_bungkus=32000.0,
            safety_stock_bungkus=1600
        ),
        Product(
            sku="SKU-WSM-DIPLO12",
            name="Wismilak Diplomat 12",
            manufacturer="PT Wismilak Inti Makmur",
            golongan="SKM",
            isi_batang=12,
            cukai_year=2026,
            bungkus_per_slop=10,
            slop_per_bal=10,
            slop_per_karton=80,
            hje_per_bungkus=22000.0,
            harga_beli_karton=14800000.0,
            harga_jual_karton=15600000.0,
            harga_jual_slop=200000.0,
            harga_jual_bungkus=21500.0,
            safety_stock_bungkus=1600
        )
    ]
    db.add_all(products)
    db.commit()

    # 3. Seed Stok Awal di Gudang Pusat & Mobil Kanvaser
    wh_sub = db.query(WarehouseLocation).filter_by(code="WH-SUB-01").first()
    wh_mlg = db.query(WarehouseLocation).filter_by(code="WH-MLG-02").first()
    van_01 = db.query(WarehouseLocation).filter_by(code="VAN-01").first()
    van_02 = db.query(WarehouseLocation).filter_by(code="VAN-02").first()

    all_prods = db.query(Product).all()

    # Stok Gudang Induk (Skala Karton besar)
    initial_stocks = [
        # Gudang Pusat Surabaya
        (wh_sub.id, all_prods[0].id, 120 * 800), # Surya 16: 120 Karton = 96.000 bks
        (wh_sub.id, all_prods[1].id, 80 * 800),  # GG Merah: 80 Karton = 64.000 bks
        (wh_sub.id, all_prods[2].id, 110 * 800), # A Mild 16: 110 Karton = 88.000 bks
        (wh_sub.id, all_prods[3].id, 90 * 800),  # 234 Kretek: 90 Karton = 72.000 bks
        (wh_sub.id, all_prods[4].id, 100 * 800), # Djarum Super: 100 Karton = 80.000 bks
        (wh_sub.id, all_prods[5].id, 50 * 800),  # Djarum Black: 50 Karton = 40.000 bks
        (wh_sub.id, all_prods[6].id, 40 * 800),  # Diplomat: 40 Karton = 32.000 bks

        # Sub-Depo Malang
        (wh_mlg.id, all_prods[0].id, 40 * 800),
        (wh_mlg.id, all_prods[2].id, 35 * 800),
        (wh_mlg.id, all_prods[4].id, 30 * 800),

        # Mobil Kanvaser 01 (Surabaya Timur)
        (van_01.id, all_prods[0].id, 5 * 800),   # 5 Karton (400 Slop)
        (van_01.id, all_prods[1].id, 3 * 800),
        (van_01.id, all_prods[2].id, 4 * 800),
        (van_01.id, all_prods[4].id, 4 * 800),

        # Mobil Kanvaser 02 (Surabaya Barat)
        (van_02.id, all_prods[0].id, 4 * 800),
        (van_02.id, all_prods[2].id, 5 * 800),
        (van_02.id, all_prods[3].id, 3 * 800)
    ]

    for loc_id, prd_id, qty_bks in initial_stocks:
        stock = StockInventory(
            location_id=loc_id,
            product_id=prd_id,
            quantity_bungkus=qty_bks
        )
        db.add(stock)

        # Audit Ledger Record
        prd = db.query(Product).get(prd_id)
        loc = db.query(WarehouseLocation).get(loc_id)
        ledger = StockLedger(
            timestamp=datetime.datetime.utcnow(),
            location_id=loc_id,
            product_id=prd_id,
            tx_type="INBOUND_PABRIK" if "GUDANG" in loc.location_type else "MUTASI_ANTAR_DEPO",
            reference_number="SALDO-AWAL-OKTOBER",
            delta_bungkus=qty_bks,
            final_stock_bungkus=qty_bks,
            operator_name="Admin Logistik Pusat",
            notes=f"Setup Saldo Awal Stok Fisik Terverifikasi ({qty_bks // 800} Karton)"
        )
        db.add(ledger)

    db.commit()

    # 4. Seed Purchase Order (PO ke Pabrik Rokok)
    po1 = PurchaseOrder(
        po_number="PO-GG-202610-001",
        supplier_name="PT Gudang Garam Tbk (Kediri Plant)",
        order_date=datetime.datetime.utcnow() - datetime.timedelta(days=3),
        target_warehouse_id=wh_sub.id,
        status="DALAM_PENGIRIMAN",
        total_nilai_rp=24640000.0 * 50, # 50 Karton Surya 16 = Rp 1.232.000.000
        notes="Pengiriman Armada Tronton Pabrik No Pol AG 9128 UQ. Estimasi tiba esok pagi."
    )
    db.add(po1)
    db.commit()

    po1_item = PurchaseOrderItem(
        po_id=po1.id,
        product_id=all_prods[0].id,
        quantity_karton=50,
        harga_karton_rp=24640000.0,
        subtotal_rp=24640000.0 * 50
    )
    db.add(po1_item)

    po2 = PurchaseOrder(
        po_number="PO-SMP-202609-088",
        supplier_name="PT HM Sampoerna Tbk (Rungkut Plant)",
        order_date=datetime.datetime.utcnow() - datetime.timedelta(days=7),
        target_warehouse_id=wh_sub.id,
        status="SELESAI",
        total_nilai_rp=24000000.0 * 40, # Rp 960.000.000
        notes="Penerimaan Barang Selesai. GRN-SMP-202609-088 terbit."
    )
    db.add(po2)
    db.commit()

    po2_item = PurchaseOrderItem(
        po_id=po2.id,
        product_id=all_prods[2].id,
        quantity_karton=40,
        harga_karton_rp=24000000.0,
        subtotal_rp=24000000.0 * 40
    )
    db.add(po2_item)
    db.commit()

    # 5. Seed Penjualan Kanvaser ke Toko Kelontong & Piutang Tempo (TOP)
    now = datetime.datetime.utcnow()
    sales_orders = [
        SalesOrder(
            invoice_number="INV-202610-001",
            customer_name="Toko Kelontong Berkah (Jl. Rungkut Asri)",
            customer_phone="08123444555",
            customer_address="Jl. Rungkut Asri Timur No. 18, Surabaya",
            source_location_id=van_01.id,
            order_date=now - datetime.timedelta(days=1),
            due_date=now + datetime.timedelta(days=6),
            payment_term="TEMPO_7_HARI",
            total_nilai_rp=6600000.0, # 20 Slop Surya 16
            terbayar_rp=2000000.0,
            sisa_piutang_rp=4600000.0,
            status="BELUM_LUNAS"
        ),
        SalesOrder(
            invoice_number="INV-202610-002",
            customer_name="Agen Sembako & Rokok Barokah Madura",
            customer_phone="08579998881",
            customer_address="Pasar Keputran Lt. 1 No. 42, Surabaya",
            source_location_id=van_01.id,
            order_date=now - datetime.timedelta(days=2),
            due_date=now - datetime.timedelta(days=1),
            payment_term="COD",
            total_nilai_rp=12800000.0,
            terbayar_rp=12800000.0,
            sisa_piutang_rp=0.0,
            status="LUNAS"
        ),
        SalesOrder(
            invoice_number="INV-202609-145",
            customer_name="Toko Rejeki Agung (Gresik Kota)",
            customer_phone="08133377788",
            customer_address="Jl. Kartini No. 54, Gresik",
            source_location_id=van_02.id,
            order_date=now - datetime.timedelta(days=18),
            due_date=now - datetime.timedelta(days=4), # Lewat jatuh tempo!
            payment_term="TEMPO_14_HARI",
            total_nilai_rp=9750000.0,
            terbayar_rp=3000000.0,
            sisa_piutang_rp=6750000.0,
            status="OVERDUE"
        ),
        SalesOrder(
            invoice_number="INV-202610-003",
            customer_name="SRC Warung Pojok Barokah",
            customer_phone="08781234567",
            customer_address="Jl. Tandes Lor No. 12, Surabaya Barat",
            source_location_id=van_02.id,
            order_date=now - datetime.timedelta(days=1),
            due_date=now + datetime.timedelta(days=13),
            payment_term="TEMPO_14_HARI",
            total_nilai_rp=4560000.0,
            terbayar_rp=1000000.0,
            sisa_piutang_rp=3560000.0,
            status="BELUM_LUNAS"
        )
    ]
    db.add_all(sales_orders)
    db.commit()

    # Sales Order Items
    so1_item = SalesOrderItem(
        sales_order_id=sales_orders[0].id,
        product_id=all_prods[0].id,
        satuan_jual="SLOP",
        quantity=20,
        equivalent_bungkus=200,
        harga_satuan_rp=330000.0,
        subtotal_rp=6600000.0
    )
    so2_item = SalesOrderItem(
        sales_order_id=sales_orders[1].id,
        product_id=all_prods[2].id,
        satuan_jual="SLOP",
        quantity=39,
        equivalent_bungkus=390,
        harga_satuan_rp=325000.0,
        subtotal_rp=12675000.0
    )
    so3_item = SalesOrderItem(
        sales_order_id=sales_orders[2].id,
        product_id=all_prods[2].id,
        satuan_jual="SLOP",
        quantity=30,
        equivalent_bungkus=300,
        harga_satuan_rp=325000.0,
        subtotal_rp=9750000.0
    )
    so4_item = SalesOrderItem(
        sales_order_id=sales_orders[3].id,
        product_id=all_prods[4].id,
        satuan_jual="SLOP",
        quantity=20,
        equivalent_bungkus=200,
        harga_satuan_rp=228000.0,
        subtotal_rp=4560000.0
    )
    db.add_all([so1_item, so2_item, so3_item, so4_item])
    db.commit()
