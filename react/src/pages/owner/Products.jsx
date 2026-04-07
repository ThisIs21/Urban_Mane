import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import { ownerTableCss } from './OwnerStyles';

const OwnerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(search);
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Habis", cls: "danger" };
    if (stock < 5) return { text: "Menipis", cls: "warning" };
    return { text: "Aman", cls: "safe" };
  };

  return (
    <>
      <style>{ownerTableCss}</style>
      <div className="owner-page">
        <div className="own-pg-header own-a1">
          <div>
            <p className="own-pg-eyebrow">Dashboard</p>
            <h1 className="own-pg-title">Monitoring Produk</h1>
            <p className="own-pg-sub">Pantau stok dan status produk toko</p>
          </div>
        </div>

        <div className="own-filter-bar own-a2">
          <input 
            type="text" 
            placeholder="Cari nama produk..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="own-search"
          />
        </div>

        <div className="own-table-panel own-a3">
          <div className="own-table-head">
            <span className="own-table-head-title">Daftar Produk</span>
            {!loading && <span className="own-count">{products.length} produk</span>}
          </div>
          <table className="own-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th className="right">Harga</th>
                <th className="center">Stok</th>
                <th className="center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="own-loading">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="5" className="own-empty">Tidak ada produk ditemukan</td></tr>
              ) : (
                products.map((p) => {
                  const status = getStockStatus(p.stock);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="own-img-thumb">
                            {p.image ? <img src={productService.getImageUrl(p.image)} alt="" /> : '📦'}
                          </div>
                          <div>
                            <div style={{ color: 'var(--t1)', fontWeight: 500 }}>{p.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>{p.sku || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td className="right" style={{ color: 'var(--t1)', fontWeight: 500 }}>{formatRp(p.price)}</td>
                      <td className="center">
                        <span className={`own-badge own-badge.${status.cls}`} style={{ display: 'inline-block' }}>
                          {p.stock} pcs - {status.text}
                        </span>
                      </td>
                      <td className="center">
                        {p.isActive 
                          ? <span className="own-badge own-badge.active">Aktif</span> 
                          : <span className="own-badge own-badge.inactive">Nonaktif</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OwnerProducts;