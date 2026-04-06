import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import Modal from '../../components/shared/Modal';
import { adminTableCss } from './adminTableStyles';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', category: '', image: '', isActive: true
  });

  const CATEGORIES = ['Hair Care', 'Beard Care', 'Styling'];
  const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const fetchProducts = async () => {
    try { setLoading(true); setProducts((await productService.getAllProducts(search)) || []); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const filtered = products.filter(p => {
    const cat = !categoryFilter || p.category === categoryFilter;
    const st  = statusFilter === '' || (statusFilter === 'active' && p.isActive) || (statusFilter === 'inactive' && !p.isActive);
    return cat && st;
  });

  const openCreate = () => {
    setEditingProduct(null);
    setFormData({ name:'', description:'', price:'', stock:'', category:'', image:'', isActive:true });
    setPhotoPreview(null);
    setIsModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setFormData({ name:p.name, description:p.description||'', price:p.price, stock:p.stock, category:p.category||'', image:p.image||'', isActive:p.isActive });
    setPhotoPreview(p.image||null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { const url = await productService.uploadFile(file); setFormData(prev=>({...prev,image:url})); setPhotoPreview(url); }
    catch { alert('Gagal upload foto'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: Number(formData.price), stock: Number(formData.stock) };
      if (editingProduct) { await productService.updateProduct(editingProduct.id, payload); }
      else { await productService.createProduct(payload); }
      setIsModalOpen(false); fetchProducts();
    } catch (err) { alert(err.response?.data?.error || 'Terjadi kesalahan'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await productService.deleteProduct(deleteTarget.id); setDeleteOpen(false); setDeleteTarget(null); fetchProducts(); }
    catch { alert('Gagal menghapus produk'); }
  };

  const set = (k, v) => setFormData(prev => ({...prev, [k]:v}));

  return (
    <>
      <style>{adminTableCss}</style>
      <div className="adm-page">

        {/* Header */}
        <div className="adm-pg-header adm-a1">
          <div>
            <p className="adm-pg-eyebrow">Manajemen</p>
            <h1 className="adm-pg-title">Produk</h1>
            <p className="adm-pg-sub">Kelola stok dan harga produk</p>
          </div>
          <button className="adm-add-btn" onClick={openCreate}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Tambah Produk
          </button>
        </div>

        {/* Filters */}
        <div className="adm-filter-bar adm-a2">
          <input className="adm-search" type="text" placeholder="Cari produk..." value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="adm-select" value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}>
            <option value="">Semua Kategori</option>
            {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select className="adm-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>

        {/* Table */}
        <div className="adm-table-panel adm-a3">
          <div className="adm-table-head">
            <span className="adm-table-head-title">Daftar Produk</span>
            {!loading && <span className="adm-count">{filtered.length} produk</span>}
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Foto</th><th>Nama</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Status</th><th className="center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? Array.from({length:4}).map((_,i)=>(
                  <tr key={i}>{[40,120,80,90,60,70,80].map((w,j)=><td key={j}><span className="skel" style={{width:w,height:13}}/></td>)}</tr>
                )) : filtered.length === 0 ? (
                  <tr><td colSpan="7"><div className="adm-empty">Tidak ada produk ditemukan.</div></td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="adm-thumb">
                        {p.image
                          ? <img src={productService.getImageUrl(p.image)} alt={p.name} onError={e=>{e.target.style.display='none';}} />
                          : p.name.charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td className="adm-td-name">{p.name}</td>
                    <td>{p.category || '—'}</td>
                    <td className="adm-td-gold">{formatRp(p.price)}</td>
                    <td>
                      <span className={`adm-badge ${p.stock < 5 ? 'stock-low' : 'stock-ok'}`}>{p.stock} pcs</span>
                    </td>
                    <td><span className={`adm-badge ${p.isActive ? 'active' : 'inactive'}`}>{p.isActive ? 'Aktif' : 'Nonaktif'}</span></td>
                    <td className="adm-td-center">
                      <div className="adm-action-cell">
                        <button className="adm-btn-edit" onClick={()=>openEdit(p)}>Edit</button>
                        <button className="adm-btn-delete" onClick={()=>{setDeleteTarget(p);setDeleteOpen(true);}}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title={editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}>
          <form onSubmit={handleSubmit}>
            <div className="adm-modal-body">
              <div className="adm-field">
                <label className="adm-field-label">Nama Produk</label>
                <input className="adm-field-input" type="text" required value={formData.name} onChange={e=>set('name',e.target.value)} placeholder="Nama produk..." />
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Deskripsi</label>
                <textarea className="adm-field-input" rows={3} value={formData.description} onChange={e=>set('description',e.target.value)} placeholder="Deskripsi..." style={{resize:'vertical'}} />
              </div>
              <div className="adm-field-row">
                <div className="adm-field">
                  <label className="adm-field-label">Harga (Rp)</label>
                  <input className="adm-field-input" type="number" required value={formData.price} onChange={e=>set('price',e.target.value)} placeholder="0" />
                </div>
                <div className="adm-field">
                  <label className="adm-field-label">Stok</label>
                  <input className="adm-field-input" type="number" value={formData.stock} onChange={e=>set('stock',e.target.value)} placeholder="0" />
                </div>
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Kategori</label>
                <select className="adm-field-input" value={formData.category} onChange={e=>set('category',e.target.value)}>
                  <option value="">Pilih kategori</option>
                  {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Foto Produk</label>
                {photoPreview && <img className="adm-preview" src={productService.getImageUrl(photoPreview)} alt="preview" onError={e=>{e.target.style.display='none';}} />}
                <input className="adm-field-input" type="file" accept="image/*" onChange={handleFileUpload} style={{paddingTop:6}} />
              </div>
              <label className="adm-toggle-row" htmlFor="prod-active">
                <input id="prod-active" type="checkbox" checked={formData.isActive} onChange={e=>set('isActive',e.target.checked)} />
                <span className="adm-toggle-label">Produk aktif</span>
              </label>
            </div>
            <div className="adm-modal-footer">
              <button type="button" className="adm-modal-cancel" onClick={()=>setIsModalOpen(false)}>Batal</button>
              <button type="submit" className="adm-modal-save">Simpan</button>
            </div>
          </form>
        </Modal>

        {/* Delete Modal */}
        <Modal isOpen={deleteOpen} onClose={()=>setDeleteOpen(false)} title="Hapus Produk">
          <p className="adm-delete-msg">Hapus produk <span className="adm-delete-name">"{deleteTarget?.name}"</span>? Tindakan ini tidak dapat dibatalkan.</p>
          <div className="adm-modal-footer">
            <button className="adm-modal-cancel" onClick={()=>setDeleteOpen(false)}>Batal</button>
            <button className="adm-modal-delete-confirm" onClick={handleDelete}>Hapus</button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Products;