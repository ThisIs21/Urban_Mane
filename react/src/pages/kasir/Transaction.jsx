import { useState, useEffect } from "react";
import productService from "../../services/productService";
import serviceService from "../../services/serviceService";
import bundleService from "../../services/bundleService";
import orderService from "../../services/orderService";
import transactionService from "../../services/transactionService";
import userService from "../../services/userService";
import Modal from "../../components/shared/Modal";
import useReceipt from '../../hooks/useReceipt';

/* ─── Design Tokens ─────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .txn-root {
    --gold: #C9A84C;
    --gold-dim: #A07830;
    --gold-glow: rgba(201,168,76,0.12);
    --surface-0: #111110;
    --surface-1: #1A1917;
    --surface-2: #222120;
    --surface-3: #2C2B29;
    --border: rgba(255,255,255,0.07);
    --border-gold: rgba(201,168,76,0.25);
    --text-1: #F0EDE6;
    --text-2: #9A9690;
    --text-3: #5C5A56;
    --danger: #E05252;
    --success: #4CAF7D;
    --info: #5B9BDC;
    --purple: #A07BC8;
    font-family: 'DM Sans', sans-serif;
    height: calc(100vh - 64px);
    display: flex;
    background: var(--surface-0);
    overflow: hidden;
  }

  .txn-root * { box-sizing: border-box; margin: 0; padding: 0; }

  /* Scrollbar */
  .txn-root ::-webkit-scrollbar { width: 4px; }
  .txn-root ::-webkit-scrollbar-track { background: transparent; }
  .txn-root ::-webkit-scrollbar-thumb { background: var(--surface-3); border-radius: 2px; }

  /* LEFT PANEL */
  .catalog-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--surface-1);
    border-right: 1px solid var(--border);
    overflow: hidden;
  }

  .catalog-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-shrink: 0;
  }

  .catalog-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-1);
    letter-spacing: 0.01em;
  }

  .search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 12px;
    transition: border-color 0.2s;
  }
  .search-box:focus-within { border-color: var(--border-gold); }
  .search-box svg { color: var(--text-3); flex-shrink: 0; }
  .search-box input {
    background: none;
    border: none;
    outline: none;
    color: var(--text-1);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    width: 140px;
  }
  .search-box input::placeholder { color: var(--text-3); }

  .tab-bar {
    display: flex;
    gap: 2px;
    padding: 12px 24px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .tab-btn {
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.02em;
  }
  .tab-btn.active { background: var(--gold); color: #111; }
  .tab-btn:not(.active) { background: transparent; color: var(--text-2); }
  .tab-btn:not(.active):hover { background: var(--surface-3); color: var(--text-1); }

  .catalog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    padding: 20px 24px;
    overflow-y: auto;
    flex: 1;
    align-content: start;
  }

  /* ITEM CARD */
  .item-card {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .item-card:hover {
    border-color: var(--border-gold);
    transform: translateY(-1px);
    background: var(--surface-3);
  }
  .item-card:active { transform: scale(0.98); }

  .item-img {
    width: 100%;
    height: 96px;
    object-fit: cover;
    background: var(--surface-3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-3);
    font-size: 11px;
    letter-spacing: 0.05em;
  }
  .item-img img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .item-info { padding: 10px 11px 11px; }
  .item-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
  }
  .item-price {
    font-size: 12px;
    font-weight: 600;
    color: var(--gold);
    margin-bottom: 7px;
  }

  .item-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 500;
    padding: 3px 7px;
    border-radius: 4px;
    letter-spacing: 0.02em;
  }
  .badge-green { background: rgba(76,175,125,0.12); color: #4CAF7D; }
  .badge-yellow { background: rgba(224,192,96,0.12); color: #E0C060; }
  .badge-red { background: rgba(224,82,82,0.12); color: #E05252; }
  .badge-blue { background: rgba(91,155,220,0.12); color: #5B9BDC; }
  .badge-purple { background: rgba(160,123,200,0.12); color: #A07BC8; }

  .info-btn {
    position: absolute;
    top: 7px;
    right: 7px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(17,17,16,0.75);
    backdrop-filter: blur(4px);
    border: 1px solid var(--border);
    color: var(--text-2);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
    z-index: 2;
  }
  .item-card:hover .info-btn { opacity: 1; }

  /* ── RIGHT PANEL ── */
  .cart-panel {
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: var(--surface-0);
    border-left: 1px solid var(--border);
  }

  .cart-header {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .cart-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .cart-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-1);
  }
  .mode-pill {
    font-size: 10px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 20px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .mode-pill.service { background: rgba(91,155,220,0.12); color: #5B9BDC; border: 1px solid rgba(91,155,220,0.2); }
  .mode-pill.direct { background: rgba(76,175,125,0.12); color: #4CAF7D; border: 1px solid rgba(76,175,125,0.2); }

  .cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cart-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--text-3);
  }
  .cart-empty svg { opacity: 0.4; }
  .cart-empty p { font-size: 13px; }

  .cart-item {
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: border-color 0.2s;
  }
  .cart-item:hover { border-color: var(--border-gold); }
  .cart-item-info { flex: 1; min-width: 0; }
  .cart-item-name { font-size: 13px; font-weight: 500; color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cart-item-price { font-size: 11px; color: var(--text-2); margin-top: 2px; }
  .qty-ctrl { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
  .qty-btn {
    width: 22px;
    height: 22px;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: var(--surface-3);
    color: var(--text-1);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    line-height: 1;
    font-family: 'DM Sans', sans-serif;
  }
  .qty-btn:hover { background: var(--gold); color: #111; border-color: var(--gold); }
  .qty-num { font-size: 13px; font-weight: 600; color: var(--text-1); min-width: 14px; text-align: center; }

  /* ── CHECKOUT AREA ── */
  .checkout-area {
    border-top: 1px solid var(--border);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;
  }

  .txn-input {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 9px 12px;
    color: var(--text-1);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }
  .txn-input:focus { border-color: var(--border-gold); }
  .txn-input::placeholder { color: var(--text-3); }
  .txn-input option { background: #222; }

  .divider { height: 1px; background: var(--border); }

  .calc-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }
  .calc-label { color: var(--text-2); }
  .calc-value { color: var(--text-1); font-weight: 500; }
  .calc-value.gold { color: var(--gold); font-size: 16px; font-weight: 600; }
  .calc-value.danger { color: var(--danger); }
  .calc-value.success { color: var(--success); }

  .discount-row { display: flex; align-items: center; gap: 8px; }
  .discount-input-wrap { position: relative; width: 72px; flex-shrink: 0; }
  .discount-input-wrap input {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 6px 20px 6px 8px;
    color: var(--text-1);
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    text-align: right;
    transition: border-color 0.2s;
  }
  .discount-input-wrap input:focus { border-color: var(--border-gold); }
  .discount-input-wrap span {
    position: absolute;
    right: 7px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-3);
    font-size: 11px;
    pointer-events: none;
  }

  .pay-input-wrap { position: relative; }
  .pay-input-wrap span {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-3);
    font-size: 12px;
    pointer-events: none;
  }
  .pay-input-wrap input {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px 10px 32px;
    color: var(--text-1);
    font-size: 15px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    text-align: right;
    transition: border-color 0.2s;
  }
  .pay-input-wrap input:focus { border-color: var(--gold); }
  .pay-input-wrap input::placeholder { color: var(--text-3); font-weight: 400; }

  .change-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 500;
  }
  .change-row.ok { background: rgba(76,175,125,0.08); color: #4CAF7D; border: 1px solid rgba(76,175,125,0.15); }
  .change-row.short { background: rgba(224,82,82,0.08); color: #E05252; border: 1px solid rgba(224,82,82,0.15); }

  .action-btn {
    width: 100%;
    padding: 13px;
    border-radius: 9px;
    border: none;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .action-btn.gold-btn { background: var(--gold); color: #111; }
  .action-btn.gold-btn:not(:disabled):hover { background: #D4AE5A; }
  .action-btn.blue-btn { background: #1D4E8A; color: #9DC5F0; border: 1px solid rgba(91,155,220,0.3); }
  .action-btn.blue-btn:not(:disabled):hover { background: #1F5799; }

  /* ── MODAL OVERRIDES ── */
  .modal-detail-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 8px;
    background: var(--surface-3);
    overflow: hidden;
    margin-bottom: 14px;
  }
  .modal-detail-img img { width: 100%; height: 100%; object-fit: cover; }

  .modal-price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .modal-price { font-size: 22px; font-weight: 700; color: var(--gold); font-family: 'Playfair Display', serif; }

  .modal-section-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); margin-bottom: 6px; }
  .modal-desc { font-size: 13px; color: var(--text-2); line-height: 1.6; }

  .modal-bundle-list { list-style: none; display: flex; flex-direction: column; gap: 5px; }
  .modal-bundle-list li { font-size: 13px; color: var(--text-2); display: flex; align-items: center; gap: 8px; }
  .modal-bundle-list li::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }

  .modal-hr { height: 1px; background: var(--border); margin: 14px 0; }

  /* Confirm modal */
  .confirm-total { text-align: center; padding: 16px 0 20px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
  .confirm-label { font-size: 12px; color: var(--text-3); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px; }
  .confirm-amount { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 600; color: var(--text-1); }
  .confirm-discount-tag { font-size: 11px; color: var(--danger); margin-top: 4px; }

  .confirm-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
  .confirm-row span:first-child { color: var(--text-2); }
  .confirm-row span:last-child { color: var(--text-1); font-weight: 500; }
`;

const Transaction = () => {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [selectedBarber, setSelectedBarber] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [payAmount, setPayAmount] = useState(0);
  const [directSaleModal, setDirectSaleModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  // Receipt utilities
  const { receiptRef, exportToPDF } = useReceipt();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prods, servs, bunds, users] = await Promise.all([
          productService.getAllProducts(""),
          serviceService.getAllServices(""),
          bundleService.getAllBundles(""),
          userService.getAllUsers(""),
        ]);
        setProducts(prods || []);
        setServices(servs || []);
        setBundles(bunds || []);
        setBarbers((users || []).filter(u => u.role === 'barber'));
      } catch (err) {
        console.error("Gagal memuat data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper: Check if bundle has any services
  const bundleHasService = (bundle) => {
    return bundle && bundle.services && bundle.services.length > 0;
  };

  // Helper: Expand bundle items to actual products and services for backend
  // Backend doesn't support type="bundle", so we need to convert bundles to products+services
  const expandBundleToItems = () => {
    const expandedItems = [];
    cart.forEach(cartItem => {
      if (cartItem.type === 'bundle' && cartItem.details) {
        // Add products from bundle
        if (cartItem.details.products && cartItem.details.products.length > 0) {
          cartItem.details.products.forEach(prod => {
            expandedItems.push({
              itemId: prod.productId || prod.id,
              quantity: prod.quantity * cartItem.quantity,  // Multiply by bundle quantity
              type: 'product'
            });
          });
        }
        // Add services from bundle
        if (cartItem.details.services && cartItem.details.services.length > 0) {
          cartItem.details.services.forEach(serv => {
            expandedItems.push({
              itemId: serv.serviceId || serv.id,
              quantity: cartItem.quantity,  // Service usually 1x per bundle
              type: 'service'
            });
          });
        }
      } else {
        // Regular product or service - add as is
        expandedItems.push({
          itemId: cartItem.id,
          quantity: cartItem.quantity,
          type: cartItem.type
        });
      }
    });
    return expandedItems;
  };

  const addToCart = (item, type) => {
    const exist = cart.find(x => x.id === item.id && x.type === type);
    // Handle bundlePrice for bundles, price for products/services
    let itemPrice;
    if (type === 'bundle') {
      itemPrice = item.bundlePrice || item.price || 0;
      console.log('[DEBUG addToCart] Bundle:', item.name, 'bundlePrice:', item.bundlePrice, 'price:', item.price, 'final:', itemPrice);
    } else {
      itemPrice = item.price || 0;
    }
    
    if (isNaN(itemPrice) || itemPrice <= 0) {
      console.error('[ERROR] Invalid price for item:', item.name, 'price:', itemPrice);
      return alert(`Harga ${item.name} tidak valid!`);
    }
    
    if (exist) {
      setCart(cart.map(x => x.id === item.id && x.type === type ? { ...x, quantity: x.quantity + 1 } : x));
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: itemPrice, quantity: 1, type, details: item }]);
    }
  };

  const removeFromCart = (id, type) => {
    const exist = cart.find(x => x.id === id && x.type === type);
    if (exist.quantity === 1) {
      setCart(cart.filter(x => !(x.id === id && x.type === type)));
    } else {
      setCart(cart.map(x => x.id === id && x.type === type ? { ...x, quantity: x.quantity - 1 } : x));
    }
  };

  const parseRupiah = (str) => parseInt(String(str).replace(/\D/g, ''), 10) || 0;
  const formatRupiahInput = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const formatRp = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.round(subTotal * (discountPercent / 100));
  const grandTotal = subTotal - discountAmount;
  const change = payAmount - grandTotal;
  
  // Service mode logic: hanya jika ada SERVICE atau BUNDLE DENGAN SERVICE
  const hasService = cart.some(i => i.type === 'service' || (i.type === 'bundle' && bundleHasService(i.details)));
  const isServiceMode = hasService || selectedBarber;

  const handleProcess = async () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    setLoading(true);
    try {
      if (isServiceMode) {
        // Validasi: jika ada service atau bundle dengan service, barber wajib dipilih
        if (hasService && !selectedBarber) {
          setLoading(false);
          return alert("Untuk Service/Paket, Barber wajib dipilih!");
        }
        // ✨ EXPAND BUNDLE: Convert bundle items to products + services
        const expandedItems = expandBundleToItems();
        console.log('[DEBUG] Expanded items for order:', expandedItems);
        await orderService.createOrder({
          customerName, barberId: selectedBarber,
          items: expandedItems,  // Use expanded items instead of raw cart
        });
        alert("Order berhasil dibuat!");
        setCart([]); setCustomerName(""); setSelectedBarber(""); setDiscountPercent(0); setPayAmount(0);
      } else {
        if (payAmount < grandTotal) { setLoading(false); return alert("Uang pembayaran kurang!"); }
        setDirectSaleModal(true);
      }
    } catch (err) {
      alert(err.response?.data?.error || "Proses gagal");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to expand bundle items for receipt display
  const expandBundleItems = () => {
    const itemsDisplay = [];
    cart.forEach(cartItem => {
      if (cartItem.type === 'bundle' && cartItem.details) {
        // Show bundle name with quantity
        itemsDisplay.push(`
          <div style="display: grid; grid-template-columns: 1fr 40px 50px; gap: 4px; margin: 6px 0; font-size: 12px; font-weight: bold; padding: 4px 0; border-bottom: 1px dotted #ddd;">
            <span style="color: #666;">📦 ${cartItem.name} x${cartItem.quantity}</span>
            <span></span>
            <span style="text-align: right;">Rp ${(cartItem.quantity * cartItem.price).toLocaleString('id-ID')}</span>
          </div>
        `);
        
        // Show products inside bundle
        if (cartItem.details.products && cartItem.details.products.length > 0) {
          cartItem.details.products.forEach(prod => {
            itemsDisplay.push(`
              <div style="display: grid; grid-template-columns: 1fr 40px 50px; gap: 4px; margin: 2px 0 2px 16px; font-size: 11px; color: #666;">
                <span>├─ ${prod.productName} (Produk)</span>
                <span style="text-align: center;">x${prod.quantity}</span>
                <span></span>
              </div>
            `);
          });
        }
        
        // Show services inside bundle
        if (cartItem.details.services && cartItem.details.services.length > 0) {
          cartItem.details.services.forEach(serv => {
            itemsDisplay.push(`
              <div style="display: grid; grid-template-columns: 1fr 40px 50px; gap: 4px; margin: 2px 0 2px 16px; font-size: 11px; color: #666;">
                <span>├─ ${serv.serviceName} (Layanan)</span>
                <span style="text-align: center;">x1</span>
                <span></span>
              </div>
            `);
          });
        }
      } else {
        // Regular product or service
        const typeLabel = cartItem.type === 'product' ? 'Produk' : 'Layanan';
        itemsDisplay.push(`
          <div style="display: grid; grid-template-columns: 1fr 40px 50px; gap: 4px; margin: 3px 0; font-size: 12px;">
            <span>${cartItem.name} (${typeLabel})</span>
            <span style="text-align: center;">x${cartItem.quantity}</span>
            <span style="text-align: right; font-weight: bold;">Rp ${(cartItem.quantity * cartItem.price).toLocaleString('id-ID')}</span>
          </div>
        `);
      }
    });
    return itemsDisplay.join('');
  };

  const handleDirectPayment = async () => {
    if (payAmount < grandTotal) return alert("Uang kurang!");
    try {
      setLoading(true);
      // ✨ EXPAND BUNDLE: Convert bundle items to products + services
      const expandedItems = expandBundleToItems();
      console.log('[DEBUG] Expanded items for transaction:', expandedItems);
      const transactionData = await transactionService.createTransaction({
        customerName,
        items: expandedItems,  // Use expanded items instead of raw cart
        discount: discountAmount, 
        payAmount, 
        paymentMethod: "cash",
        cashierName: localStorage.getItem('userName') || 'Kasir',
        cashierId: localStorage.getItem('userId') || '',
      });
      
      const cashierName = localStorage.getItem('userName') || 'Kasir';
      
      // Siapkan HTML receipt untuk PDF
      const receiptHTML = `<div style="width: 80mm; margin: 0 auto; padding: 15px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.5;">
        <div style="text-align: center; margin-bottom: 12px;">
          <div style="font-size: 32px; margin-bottom: 4px;">✂️</div>
          <h1 style="font-family: 'Playfair Display', serif; font-size: 18px; font-weight: bold; margin: 4px 0; letter-spacing: 1px;">URBAN MANE</h1>
          <p style="font-size: 10px; color: #666; margin: 2px 0 0 0;">Barbershop Professional</p>
          <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        </div>
        <div style="margin: 8px 0; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Invoice:</span><span>${transactionData._id || transactionData.id}</span></div>
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Tanggal:</span><span>${new Date().toLocaleString('id-ID')}</span></div>
        </div>
        <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        <div style="margin: 8px 0; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Customer:</span><span>${customerName || 'Walk-in'}</span></div>
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Kasir:</span><span>${cashierName}</span></div>
        </div>
        <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        <div style="margin: 8px 0;">
          <div style="display: grid; grid-template-columns: 1fr 40px 50px; gap: 4px; margin-bottom: 4px; font-weight: bold; font-size: 11px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">
            <span style="text-align: left;">Item</span><span style="text-align: center;">Qty</span><span style="text-align: right;">Harga</span>
          </div>
          ${expandBundleItems()}
        </div>
        <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        <div style="text-align: right; margin: 8px 0;">
          <div style="display: flex; justify-content: space-between; margin: 4px 0; font-size: 12px;"><span>Subtotal:</span><span>Rp ${(grandTotal + discountAmount).toLocaleString('id-ID')}</span></div>
          ${discountAmount > 0 ? `<div style="display: flex; justify-content: space-between; margin: 4px 0; font-size: 12px; color: #E05252;"><span>Diskon:</span><span>-Rp ${discountAmount.toLocaleString('id-ID')}</span></div>` : ''}
          <div style="border-top: 1px solid #ccc; margin: 6px 0;"></div>
          <div style="display: flex; justify-content: space-between; margin: 4px 0; font-size: 14px; font-weight: bold;"><span>TOTAL:</span><span>Rp ${grandTotal.toLocaleString('id-ID')}</span></div>
        </div>
        <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        <div style="margin: 8px 0; text-align: left; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight:bold;">Metode:</span><span>Cash</span></div>
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Dibayar:</span><span>Rp ${payAmount.toLocaleString('id-ID')}</span></div>
          ${(payAmount - grandTotal) > 0 ? `<div style="display: flex; justify-content: space-between; margin: 4px 0; color: #4CAF7D; font-weight: bold;"><span>Kembalian:</span><span>Rp ${(payAmount - grandTotal).toLocaleString('id-ID')}</span></div>` : ''}
        </div>
        <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        <div style="text-align: center; margin-top: 12px; font-size: 11px; color: #666;">
          <p style="margin: 3px 0;">Terima kasih atas kunjungan Anda!</p>
          <p style="margin: 3px 0;">Semoga puas dengan layanan kami</p>
        </div>
      </div>`; 
      
      receiptRef.current.innerHTML = receiptHTML;
      
      // Auto-download PDF
      setTimeout(() => {
        exportToPDF(`struk-transaksi-${Date.now()}.pdf`);
      }, 200);
      
      setDirectSaleModal(false);
      setCart([]); 
      setCustomerName(""); 
      setDiscountPercent(0); 
      setPayAmount(0);
      
      alert("Transaksi Sukses! PDF sedang di-download...");
      
      // Auto-reload halaman setelah 3 detik
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.error || "Gagal bayar");
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (item, type) => { setSelectedItem({ ...item, type }); setDetailModal(true); };

  const getStockBadge = (stock) => {
    if (stock === 0) return { text: `Habis`, cls: "badge-red" };
    if (stock < 5) return { text: `Hampir Habis (${stock})`, cls: "badge-yellow" };
    return { text: `Stok ${stock}`, cls: "badge-green" };
  };

  const getImgUrl = (item, type) => {
    if (!item.image) return null;
    if (type === "product") return productService.getImageUrl(item.image);
    if (type === "service") return serviceService.getImageUrl(item.image);
    return bundleService.getImageUrl(item.image);
  };

  const filtered = {
    products: products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    services: services.filter(s => s.name.toLowerCase().includes(search.toLowerCase())),
    bundles: bundles.filter(b => b.name.toLowerCase().includes(search.toLowerCase())),
  };

  const currentItems = activeTab === "products" ? filtered.products : activeTab === "services" ? filtered.services : filtered.bundles;
  const currentType = activeTab === "products" ? "product" : activeTab === "services" ? "service" : "bundle";

  return (
    <>
      <style>{css}</style>
      <div className="txn-root" style={{ margin: "-24px -24px 0" }}>

        {/* ── LEFT: CATALOG ── */}
        <div className="catalog-panel">
          <div className="catalog-header">
            <h2 className="catalog-title">Katalog</h2>
            <div className="search-box">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input type="text" placeholder="Cari item..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="tab-bar">
            {[["products","Produk"],["services","Layanan"],["bundles","Paket"]].map(([key, label]) => (
              <button key={key} className={`tab-btn ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>
                {label}
              </button>
            ))}
          </div>

          {loading && !cart.length ? (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text-3)", fontSize:13 }}>Memuat data...</div>
          ) : (
            <div className="catalog-grid">
              {currentItems.length === 0 ? (
                <div style={{ gridColumn:"1/-1", textAlign:"center", color:"var(--text-3)", fontSize:13, paddingTop:40 }}>Tidak ada item</div>
              ) : currentItems.map(item => {
                // Determine display price: bundlePrice for bundles, price for others
                const displayPrice = currentType === 'bundle' ? item.bundlePrice : item.price;
                const stockBadge = (currentType === 'product' || currentType === 'bundle') ? getStockBadge(item.stock) : null;
                const imgUrl = getImgUrl(item, currentType);
                const inCart = cart.find(x => x.id === item.id && x.type === currentType);
                return (
                  <div key={item.id} className="item-card">
                    <button className="info-btn" onClick={e => { e.stopPropagation(); openDetail(item, currentType); }}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <div className="item-img" onClick={() => addToCart(item, currentType)}>
                      {imgUrl ? (
                        <img src={imgUrl} alt={item.name} onError={e => { e.target.onerror=null; e.target.src="https://via.placeholder.com/160x96?text=—"; }} />
                      ) : <span>FOTO</span>}
                      {inCart && (
                        <div style={{ position:"absolute", top:6, left:6, background:"var(--gold)", color:"#111", borderRadius:"50%", width:18, height:18, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          {inCart.quantity}
                        </div>
                      )}
                    </div>
                    <div className="item-info" onClick={() => addToCart(item, currentType)}>
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">{formatRp(displayPrice)}</p>
                      {(currentType === 'product' || currentType === 'bundle') && <span className={`item-badge ${stockBadge?.cls}`}>{stockBadge?.text}</span>}
                      {currentType === 'service' && item.duration && <span className="item-badge badge-blue">{item.duration} menit</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT: CART ── */}
        <div className="cart-panel">
          <div className="cart-header">
            <div className="cart-title-row">
              <h2 className="cart-title">Keranjang</h2>
              <span className={`mode-pill ${isServiceMode ? "service" : "direct"}`}>
                {isServiceMode ? "Service Order" : "Direct Sale"}
              </span>
            </div>
            {cart.length > 0 && (
              <div style={{ fontSize:12, color:"var(--text-3)" }}>{cart.length} jenis · {cart.reduce((s,i)=>s+i.quantity,0)} item</div>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10 }}>
              <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color:"var(--text-3)", opacity:0.5 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeWidth="1.5"/>
                <line x1="3" y1="6" x2="21" y2="6" strokeWidth="1.5"/>
                <path d="M16 10a4 4 0 01-8 0" strokeWidth="1.5"/>
              </svg>
              <p style={{ fontSize:13, color:"var(--text-3)" }}>Klik item untuk menambah</p>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id + item.type} className="cart-item">
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">{formatRp(item.price)} / item</p>
                  </div>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => removeFromCart(item.id, item.type)}>−</button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => addToCart({ id:item.id, name:item.name, price:item.price }, item.type)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="checkout-area">
            {/* Cashier Info */}
            <div style={{ 
              padding: '12px', 
              background: 'rgba(201,168,76,0.08)', 
              border: '1px solid rgba(201,168,76,0.2)', 
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px'
            }}>
              <span style={{ color: 'var(--text-3)' }}>Kasir: </span>
              <span style={{ color: 'var(--gold)', fontWeight: '600' }}>
                {localStorage.getItem('userName') || 'Nama Kasir'}
              </span>
            </div>

            <input className="txn-input" type="text" placeholder="Nama Pelanggan (opsional)" value={customerName} onChange={e => setCustomerName(e.target.value)} />

            <select className="txn-input" value={selectedBarber} onChange={e => setSelectedBarber(e.target.value)}>
              <option value="">Pilih Barber (opsional)</option>
              {barbers.map(b => (
                <option key={b.id} value={b.id}>{b.name} — {b.status === 'busy' ? 'Sibuk' : 'Tersedia'}</option>
              ))}
            </select>

            {!isServiceMode && cart.length > 0 && (
              <>
                <div className="divider" />
                <div className="calc-row">
                  <span className="calc-label">Subtotal</span>
                  <span className="calc-value">{formatRp(subTotal)}</span>
                </div>
                <div className="calc-row" style={{ gap:8 }}>
                  <span className="calc-label" style={{ flex:1 }}>Diskon</span>
                  <div className="discount-input-wrap">
                    <input type="text" inputMode="numeric" value={discountPercent} maxLength={3}
                      onChange={e => { let v=parseInt(e.target.value.replace(/\D/g,''),10)||0; if(v>100)v=100; setDiscountPercent(v); }} />
                    <span>%</span>
                  </div>
                  {discountPercent > 0 && <span className="calc-value danger">−{formatRp(discountAmount)}</span>}
                </div>
                <div className="calc-row">
                  <span style={{ fontSize:14, fontWeight:600, color:"var(--text-1)" }}>Total</span>
                  <span className="calc-value gold">{formatRp(grandTotal)}</span>
                </div>
                <div className="pay-input-wrap">
                  <span>Rp</span>
                  <input type="text" inputMode="numeric" placeholder="0" value={formatRupiahInput(payAmount)} onChange={e => setPayAmount(parseRupiah(e.target.value))} />
                </div>
                {payAmount > 0 && (
                  <div className={`change-row ${change >= 0 ? "ok" : "short"}`}>
                    <span>Kembalian</span>
                    <span>{formatRp(change)}</span>
                  </div>
                )}
              </>
            )}

            {isServiceMode && cart.length > 0 && (
              <>
                <div className="divider" />
                <div className="calc-row">
                  <span style={{ fontSize:14, fontWeight:600, color:"var(--text-1)" }}>Total Order</span>
                  <span className="calc-value gold">{formatRp(subTotal)}</span>
                </div>
              </>
            )}

            <button
              className={`action-btn ${isServiceMode ? "blue-btn" : "gold-btn"}`}
              onClick={handleProcess}
              disabled={loading || cart.length === 0}
            >
              {loading ? "Memproses..." : isServiceMode ? "Buat Order →" : "Bayar Sekarang →"}
            </button>
          </div>
        </div>

        {/* ── MODAL DETAIL ── */}
        <Modal isOpen={detailModal} onClose={() => setDetailModal(false)} title={selectedItem?.name || "Detail Item"}>
          {selectedItem && (
            <div>
              <div className="modal-detail-img">
                <img
                  src={getImgUrl(selectedItem, selectedItem.type)}
                  alt={selectedItem.name}
                  onError={e => { e.target.src="https://via.placeholder.com/400x160?text=No+Image"; }}
                />
              </div>
              <div className="modal-price-row">
                <span className="modal-price">{formatRp(selectedItem.price)}</span>
                {selectedItem.type === 'product' && (
                  <span className={`item-badge ${getStockBadge(selectedItem.stock).cls}`}>{getStockBadge(selectedItem.stock).text}</span>
                )}
                {selectedItem.type === 'service' && selectedItem.duration && (
                  <span className="item-badge badge-blue">{selectedItem.duration} menit</span>
                )}
                {selectedItem.type === 'bundle' && (
                  <span className="item-badge badge-purple">Paket Hemat</span>
                )}
              </div>
              <div className="modal-hr" />
              <p className="modal-section-label">Deskripsi</p>
              <p className="modal-desc">{selectedItem.description || "Tidak ada deskripsi tersedia."}</p>
              {selectedItem.type === 'bundle' && selectedItem.items?.length > 0 && (
                <>
                  <div className="modal-hr" />
                  <p className="modal-section-label">Isi Paket</p>
                  <ul className="modal-bundle-list">
                    {selectedItem.items.map((i, idx) => <li key={idx}>{i.name}</li>)}
                  </ul>
                </>
              )}
              <div className="modal-hr" />
              <button
                className="action-btn gold-btn"
                onClick={() => { addToCart(selectedItem, selectedItem.type); setDetailModal(false); }}
              >
                + Tambah ke Keranjang
              </button>
            </div>
          )}
        </Modal>

        {/* ── MODAL DIRECT SALE ── */}
        <Modal isOpen={directSaleModal} onClose={() => setDirectSaleModal(false)} title="Konfirmasi Pembayaran">
          <div>
            <div className="confirm-total">
              <p className="confirm-label">Total Tagihan</p>
              <p className="confirm-amount">{formatRp(grandTotal)}</p>
              {discountPercent > 0 && <p className="confirm-discount-tag">Diskon {discountPercent}% telah diterapkan</p>}
            </div>
            <div className="confirm-row"><span>Uang Diterima</span><span>{formatRp(payAmount)}</span></div>
            <div className="confirm-row" style={{ marginBottom:16 }}>
              <span>Kembalian</span>
              <span style={{ color:"var(--success)", fontWeight:700, fontSize:16 }}>{formatRp(change)}</span>
            </div>
            <button className="action-btn gold-btn" onClick={handleDirectPayment}>
              Selesaikan Pembayaran →
            </button>
          </div>
        </Modal>

        {/* ── Hidden receipt ref for PDF generation ── */}
        <div ref={receiptRef} style={{ display: 'none' }}></div>
      </div>
    </>
  );
};

export default Transaction;