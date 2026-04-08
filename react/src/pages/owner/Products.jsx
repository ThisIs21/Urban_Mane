import { useState, useEffect, useCallback } from 'react';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import { ownerInventoryCss } from './OwnerStyles';

const OwnerProducts = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(search);
      setProducts(data || []);

      // Fetch order history for current month
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
      const orderData = await orderService.getHistory(firstDay, lastDay);
      setOrders(orderData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  const calculateProductSales = (productId) => {
    return orders.reduce((total, order) => {
      if (!order.items || order.items.length === 0) return total;
      return total + order.items.reduce((sum, item) =>
        sum + (item.product_id === productId ? (item.quantity || 0) : 0), 0);
    }, 0);
  };

  const calculateProductRevenue = (productId) => {
    return orders.reduce((total, order) => {
      if (!order.items || order.items.length === 0) return total;
      return total + order.items.reduce((sum, item) => {
        if (item.product_id !== productId) return sum;
        return sum + ((item.price || 0) * (item.quantity || 0));
      }, 0);
    }, 0);
  };

  const getLastRestockDate = (productId) => {
    const productOrders = orders
      .flatMap(order => order.items || [])
      .filter(item => item.product_id === productId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (productOrders.length === 0) {
      return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    return new Date(productOrders[0].created_at);
  };

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // Calculate metrics
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const topSellers = products.filter(p => p.isActive).length;

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", badge: "danger", color: "red" };
    if (stock < 5) return { text: "Low Stock", badge: "warning", color: "amber" };
    return { text: "In Stock", badge: "success", color: "green" };
  };

  const getStockPercent = (stock, maxStock = 100) => Math.min((stock / maxStock) * 100, 100);

  const categories = ["all", ...new Set(products.map(p => p.category))];
  const filteredProducts = categoryFilter === "all"
    ? products
    : products.filter(p => p.category === categoryFilter);

  return (
    <>
      <style>{ownerInventoryCss}</style>
      <div className="inv-container">
        {/* Header */}
        <div className="inv-header">
          <div>
            <div className="inv-title">Inventory Overview</div>
            <div className="inv-timestamp">Perbaruan terakhir: Hari ini, {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="inv-stats-grid">
          <div className="inv-stat-card inv-stat-gold">
            <div className="inv-stat-icon inv-stat-icon-gold">📦</div>
            <div className="inv-stat-number">{totalProducts}</div>
            <div className="inv-stat-label">Total Produk</div>
            <div className="inv-stat-badge">+2 Bulan Ini</div>
          </div>

          <div className="inv-stat-card inv-stat-green">
            <div className="inv-stat-icon inv-stat-icon-green">💰</div>
            <div className="inv-stat-number">{formatRp(totalStockValue)}</div>
            <div className="inv-stat-label">Total Nilai Stok</div>
          </div>

          <div className="inv-stat-card inv-stat-red">
            <div className="inv-stat-icon inv-stat-icon-red">⚠️</div>
            <div className="inv-stat-number">{lowStockItems}</div>
            <div className="inv-stat-label">Low Stock Items</div>
            {lowStockItems > 0 && <div className="inv-stat-badge inv-stat-badge-danger">Perlu Restok</div>}
          </div>

          <div className="inv-stat-card inv-stat-blue">
            <div className="inv-stat-icon inv-stat-icon-blue">⭐</div>
            <div className="inv-stat-number">{topSellers}</div>
            <div className="inv-stat-label">Top Sellers</div>
          </div>
        </div>

        {/* Filters */}
        <div className="inv-filter-section">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="inv-search-input"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="inv-filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
          <select className="inv-filter-select">
            <option>All Stock Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>

        {/* Table */}
        <div className="inv-table-container">
          <div className="inv-table-header">
            <div className="inv-table-title">Product Details</div>
          </div>

          {loading ? (
            <div className="inv-loading">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="inv-empty">Tidak ada produk ditemukan</div>
          ) : (
            <div className="inv-table-wrapper">
              <table className="inv-table">
                <thead>
                  <tr>
                    <th className="inv-col-product">Product Info</th>
                    <th className="inv-col-stock">Stock Status</th>
                    <th className="inv-col-sold">Sold (MTD)</th>
                    <th className="inv-col-revenue">Revenue</th>
                    <th className="inv-col-restock">Last Restock</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = getStockStatus(product.stock);
                    const stockPercent = getStockPercent(product.stock);
                    return (
                      <tr key={product.id} className="inv-table-row">
                        <td className="inv-col-product">
                          <div className="inv-product-cell">
                            <div className="inv-product-thumb">
                              {product.image ? (
                                <img src={productService.getImageUrl(product.image)} alt={product.name} />
                              ) : (
                                <div className="inv-product-icon">📦</div>
                              )}
                            </div>
                            <div className="inv-product-info">
                              <div className="inv-product-name">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="inv-col-stock">
                          <div className="inv-stock-cell">
                            <div className="inv-stock-bar-wrapper">
                              <div className="inv-stock-bar">
                                <div
                                  className={`inv-stock-progress inv-stock-${status.color}`}
                                  style={{ width: `${stockPercent}%` }}
                                />
                              </div>
                              <div className="inv-stock-units">{product.stock} units</div>
                            </div>
                            <div className={`inv-stock-badge inv-stock-${status.color}`}>
                              {status.text}
                            </div>
                          </div>
                        </td>
                        <td className="inv-col-sold">
                          <div className="inv-cell-text">{calculateProductSales(product.id)} units</div>
                        </td>
                        <td className="inv-col-revenue">
                          <div className="inv-cell-revenue">{formatRp(calculateProductRevenue(product.id))}</div>
                        </td>
                        <td className="inv-col-restock">
                          <div className="inv-cell-text">{getLastRestockDate(product.id).toISOString().split('T')[0]}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OwnerProducts;