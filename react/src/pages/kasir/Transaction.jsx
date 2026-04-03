import { useState, useEffect } from 'react';
// Import semua service yang dibutuhkan
import productService from '../../services/productService';
import serviceService from '../../services/serviceService'; // <--- TAMBAHKAN INI
import bundleService from '../../services/bundleService';
import transactionService from '../../services/transactionService';
import Modal from '../../components/shared/Modal';

const Transaction = () => {
  // State untuk Data Master
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]); // <--- TAMBAHKAN INI
  const [bundles, setBundles] = useState([]);
  
  // State UI
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'services', 'bundles'
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State Keranjang & Pembayaran
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [payAmount, setPayAmount] = useState(0);
  
  // Modal
  const [successModal, setSuccessModal] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch semua data paralel
        const [prods, servs, bunds] = await Promise.all([
          productService.getAllProducts(''),
          serviceService.getAllServices(''), // Ambil services
          bundleService.getAllBundles('')
        ]);

        setProducts(prods || []);
        setServices(servs || []);
        setBundles(bunds || []);
      } catch (err) {
        console.error("Gagal memuat data master", err);
        alert("Gagal memuat data produk. Cek console untuk detail error.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // === LOGIC KERANJANG ===

  const addToCart = (item, type) => {
    // Cek apakah item sudah ada di keranjang
    const exist = cart.find(x => x.id === item.id && x.type === type);
    
    if (exist) {
      // Kalau sudah ada, tambah quantity
      setCart(cart.map(x => 
        x.id === item.id && x.type === type ? { ...x, quantity: x.quantity + 1 } : x
      ));
    } else {
      // Kalau belum, tambahkan item baru
      setCart([...cart, { 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1, 
        type: type // 'product', 'service', atau 'bundle'
      }]);
    }
  };

  const removeFromCart = (id, type) => {
    const exist = cart.find(x => x.id === id && x.type === type);
    if (exist.quantity === 1) {
      setCart(cart.filter(x => !(x.id === id && x.type === type)));
    } else {
      setCart(cart.map(x => 
        x.id === id && x.type === type ? { ...x, quantity: x.quantity - 1 } : x
      ));
    }
  };

  // === KALKULASI ===
  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const grandTotal = subTotal - discount;
  const change = payAmount - grandTotal;

  // === SUBMIT ===
  const handleProcess = async () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (payAmount < grandTotal) return alert("Uang pembayaran kurang!");

    setLoading(true);
    try {
      const payload = {
        customerName: customerName,
        discount: Number(discount),
        payAmount: Number(payAmount),
        paymentMethod: "cash",
        items: cart.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          type: item.type
        }))
      };

      const res = await transactionService.createTransaction(payload);
      setLastInvoice(res);
      setSuccessModal(true);
      
      // Reset
      setCart([]);
      setCustomerName('');
      setDiscount(0);
      setPayAmount(0);
    } catch (err) {
      alert(err.response?.data?.error || "Transaksi gagal");
    } finally {
      setLoading(false);
    }
  };

  // Filter untuk search
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredServices = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const filteredBundles = bundles.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // Helper untuk render item card (biar ga ngetik ulang)
  const renderItems = (items, type) => (
    items.map(item => (
      <div 
        key={item.id} 
        onClick={() => addToCart(item, type)}
        className="p-3 rounded-lg border border-border bg-card hover:border-gold cursor-pointer transition-all"
        style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="h-20 rounded bg-secondary mb-2 flex items-center justify-center text-xs text-muted overflow-hidden">
          {item.image ? (
            <img 
              src={ (type === 'product' ? productService.getImageUrl(item.image) : 
                     type === 'service' ? serviceService.getImageUrl(item.image) : 
                     bundleService.getImageUrl(item.image)) 
              } 
              alt={item.name} 
              className="h-full w-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }} 
            />
          ) : 'IMAGE'}
        </div>
        <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
        <p className="text-xs text-gold font-bold">{formatRp(item.price)}</p>
        {type === 'product' && <p className="text-xs text-muted mt-1">Stok: {item.stock}</p>}
      </div>
    ))
  );

  return (
    <div className="flex h-[calc(100vh-64px)] gap-4 -mx-6 -my-6 p-0">
      
      {/* KIRI: Katalog */}
      <div className="w-2/3 bg-secondary p-6 overflow-y-auto" style={{ backgroundColor: 'var(--color-secondary)' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Pilih Item</h2>
          <input 
            type="text" 
            placeholder="Cari..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 rounded bg-primary border border-border text-sm w-40"
            style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('products')} className={`px-4 py-1 rounded text-sm font-medium whitespace-nowrap transition ${activeTab === 'products' ? 'bg-gold text-black' : 'bg-card text-muted'}`}>
            Produk
          </button>
          <button onClick={() => setActiveTab('services')} className={`px-4 py-1 rounded text-sm font-medium whitespace-nowrap transition ${activeTab === 'services' ? 'bg-gold text-black' : 'bg-card text-muted'}`}>
            Layanan
          </button>
          <button onClick={() => setActiveTab('bundles')} className={`px-4 py-1 rounded text-sm font-medium whitespace-nowrap transition ${activeTab === 'bundles' ? 'bg-gold text-black' : 'bg-card text-muted'}`}>
            Paket
          </button>
        </div>

        {/* Grid Content */}
        {loading ? (
           <div className="text-center text-muted py-10">Loading data...</div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {activeTab === 'products' && renderItems(filteredProducts, 'product')}
            {activeTab === 'services' && renderItems(filteredServices, 'service')}
            {activeTab === 'bundles' && renderItems(filteredBundles, 'bundle')}
          </div>
        )}
      </div>

      {/* KANAN: Keranjang */}
      <div className="w-1/3 bg-card flex flex-col border-l border-border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        
        <div className="p-4 border-b border-border" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-bold text-white">Keranjang</h2>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {cart.length === 0 ? (
            <p className="text-center text-muted text-sm mt-10">Klik item untuk menambahkan</p>
          ) : (
            cart.map(item => (
              <div key={item.id + item.type} className="flex items-center gap-3 p-2 rounded bg-secondary" style={{ backgroundColor: 'var(--color-secondary)' }}>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-muted">{formatRp(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(item.id, item.type)} className="w-6 h-6 rounded bg-danger text-white font-bold text-xs">-</button>
                  <span className="text-sm text-white w-4 text-center">{item.quantity}</span>
                  <button onClick={() => addToCart({id: item.id, name: item.name, price: item.price}, item.type)} className="w-6 h-6 rounded bg-success text-white font-bold text-xs">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Area Pembayaran */}
        <div className="border-t border-border p-4 space-y-3" style={{ borderColor: 'var(--color-border)' }}>
          <input 
            type="text" 
            placeholder="Nama Pelanggan" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-2 rounded bg-primary border border-border text-sm"
          />
          
          <div className="flex justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span>{formatRp(subTotal)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted">Diskon (Rp)</span>
            <input 
              type="number" 
              value={discount} 
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-24 p-1 rounded bg-primary border border-border text-right text-white text-xs"
            />
          </div>

          <div className="border-t border-border pt-3 space-y-2" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span className="text-gold">{formatRp(grandTotal)}</span>
            </div>

            <input 
              type="number" 
              placeholder="Uang Bayar" 
              value={payAmount}
              onChange={(e) => setPayAmount(Number(e.target.value))}
              className="flex-1 w-full p-2 rounded bg-primary border border-border"
            />

            {payAmount > 0 && (
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted">Kembalian</span>
                <span className={change >= 0 ? 'text-green-400' : 'text-red-400'}>{formatRp(change)}</span>
              </div>
            )}
          </div>

          <button 
            onClick={handleProcess}
            disabled={loading || cart.length === 0}
            className="w-full py-3 rounded-lg font-bold text-black transition disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-gold)' }}
          >
            {loading ? "Memproses..." : "PROSES TRANSAKSI"}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={successModal} onClose={() => setSuccessModal(false)} title="Transaksi Sukses">
         {/* Isi modal sama seperti sebelumnya */}
         <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-white mb-2">Berhasil!</h3>
            <p className="text-muted mb-6">Invoice: {lastInvoice?.invoiceNumber}</p>
            <button onClick={() => setSuccessModal(false)} className="px-6 py-2 rounded bg-gold text-black font-semibold">Selesai</button>
         </div>
      </Modal>
    </div>
  );
};

export default Transaction;