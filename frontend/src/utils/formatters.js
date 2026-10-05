// Utility for Indonesian Rupiah Formatting & Cigarette Packaging Conversion

export const formatRupiah = (val) => {
  if (val === undefined || val === null || isNaN(val)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
};

export const formatNumber = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return new Intl.NumberFormat('id-ID').format(val);
};

// Konversi Satuan Rokok: Bungkus -> Karton, Bal, Slop, Sisa Bungkus
export const calculateCigaretteUoM = (totalBungkus, slopPerKarton = 80, bungkusPerSlop = 10, slopPerBal = 10) => {
  const bksPerKarton = slopPerKarton * bungkusPerSlop; // misal 800 bks
  const bksPerBal = slopPerBal * bungkusPerSlop;       // misal 100 bks
  const bksPerSlop = bungkusPerSlop;                  // misal 10 bks

  const karton = Math.floor(totalBungkus / bksPerKarton);
  let rem = totalBungkus % bksPerKarton;

  const bal = Math.floor(rem / bksPerBal);
  rem = rem % bksPerBal;

  const slop = Math.floor(rem / bksPerSlop);
  const bungkus = rem % bksPerSlop;

  return {
    karton,
    bal,
    slop,
    bungkus,
    summaryString: `${karton} Dus / ${bal} Bal / ${slop} Slop${bungkus > 0 ? ` + ${bungkus} Bks` : ''}`
  };
};
