export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateIndo = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
};

export const generateWhatsAppShareText = (
  productName: string,
  price: number,
  description: string,
  productLink: string
): string => {
  return `Assalamu'alaikum Warahmatullahi Wabarakatuh,

Tersedia produk pilihan terbaik:
*${productName}*

💰 Harga Spesial: *${formatRupiah(price)}*

📝 *Deskripsi Singkat:*
${description.slice(0, 160)}${description.length > 160 ? '...' : ''}

🛒 *Pesan Sekarang & Cek Detail:*
${productLink}

Produk 100% Original, Terpercaya & Amanah.
Terima kasih.`;
};

export const downloadCsvFile = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const processRow = (row: (string | number)[]) => {
    return row
      .map((val) => {
        const text = String(val ?? '');
        return `"${text.replace(/"/g, '""')}"`;
      })
      .join(',');
  };

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(processRow)].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
