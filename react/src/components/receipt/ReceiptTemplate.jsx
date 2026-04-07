import './ReceiptStyle.css';

/**
 * ReceiptTemplate Component
 * Mendukung Transaction & Order
 * Format: Thermal Receipt (80mm)
 */

const ReceiptTemplate = ({ data, type = 'transaction' }) => {
  if (!data) return null;

  // Aggregate items dengan nama sama
  const aggregateItems = (items) => {
    const map = {};
    items.forEach(item => {
      const key = item.name;
      if (map[key]) {
        map[key].quantity += item.quantity;
        map[key].subTotal += item.subTotal;
      } else {
        map[key] = { ...item };
      }
    });
    return Object.values(map);
  };

  const aggregatedItems = aggregateItems(data.items || []);

  const formatRp = (num) => {
    if (!num) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="receipt-container">
      {/* HEADER */}
      <div className="receipt-header">
        <div className="receipt-logo">✂️</div>
        <h1 className="receipt-title">URBAN MANE</h1>
        <p className="receipt-subtitle">Barbershop Professional</p>
        <div className="receipt-divider"></div>
      </div>

      {/* INVOICE INFO */}
      <div className="receipt-info">
        <div className="receipt-row">
          <span className="receipt-label">Invoice:</span>
          <span className="receipt-value">{data.invoiceNumber}</span>
        </div>
        <div className="receipt-row">
          <span className="receipt-label">Tanggal:</span>
          <span className="receipt-value">{formatDate(data.createdAt)}</span>
        </div>
        <div className="receipt-row">
          <span className="receipt-label">Tipe:</span>
          <span className="receipt-value">{type === 'transaction' ? 'Penjualan' : 'Service'}</span>
        </div>
      </div>

      <div className="receipt-divider"></div>

      {/* CUSTOMER & STAFF INFO */}
      <div className="receipt-people">
        <div className="receipt-row">
          <span className="receipt-label">Customer:</span>
          <span className="receipt-value">{data.customerName || 'Walk-in'}</span>
        </div>
        {type === 'transaction' ? (
          <div className="receipt-row">
            <span className="receipt-label">Kasir:</span>
            <span className="receipt-value">{data.cashierName || '-'}</span>
          </div>
        ) : (
          <div className="receipt-row">
            <span className="receipt-label">Barber:</span>
            <span className="receipt-value">{data.barberName || '-'}</span>
          </div>
        )}
      </div>

      <div className="receipt-divider"></div>

      {/* ITEMS TABLE */}
      <div className="receipt-items">
        <div className="receipt-items-header">
          <span className="col-name">Produk/Layanan</span>
          <span className="col-qty">Qty</span>
          <span className="col-price">Harga</span>
        </div>
        <div className="receipt-divider-thin"></div>

        {aggregatedItems.map((item, idx) => (
          <div key={idx} className="receipt-items-row">
            <span className="col-name">{item.name}</span>
            <span className="col-qty">x{item.quantity}</span>
            <span className="col-price">{formatRp(item.subTotal)}</span>
          </div>
        ))}
      </div>

      <div className="receipt-divider"></div>

      {/* SUMMARY */}
      <div className="receipt-summary">
        <div className="receipt-summary-row">
          <span>Subtotal:</span>
          <span>{formatRp(data.totalPrice)}</span>
        </div>
        {data.discount > 0 && (
          <div className="receipt-summary-row discount">
            <span>Diskon:</span>
            <span>-{formatRp(data.discount)}</span>
          </div>
        )}
        <div className="receipt-divider-thin"></div>
        <div className="receipt-summary-row total">
          <span>TOTAL:</span>
          <span>{formatRp(data.grandTotal || data.totalPrice)}</span>
        </div>
      </div>

      <div className="receipt-divider"></div>

      {/* PAYMENT INFO */}
      <div className="receipt-payment">
        <div className="receipt-row">
          <span className="receipt-label">Metode:</span>
          <span className="receipt-value">{data.paymentMethod || '-'}</span>
        </div>
        <div className="receipt-row">
          <span className="receipt-label">Dibayar:</span>
          <span className="receipt-value">{formatRp(data.payAmount)}</span>
        </div>
        {(data.change !== undefined && data.change > 0) && (
          <div className="receipt-row change">
            <span className="receipt-label">Kembalian:</span>
            <span className="receipt-value">{formatRp(data.change)}</span>
          </div>
        )}
      </div>

      <div className="receipt-divider"></div>

      {/* FOOTER */}
      <div className="receipt-footer">
        <p>Terima kasih atas kunjungan Anda!</p>
        <p>Semoga puas dengan layanan kami</p>
        <p className="receipt-footer-date">{formatDate(data.createdAt)}</p>
      </div>
    </div>
  );
};

export default ReceiptTemplate;