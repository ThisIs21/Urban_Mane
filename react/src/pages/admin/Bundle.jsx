import { useState, useEffect, useCallback } from 'react';
import bundleService from '../../services/bundleService';
import productService from '../../services/productService';
import serviceService from '../../services/serviceService';
import Modal from '../../components/shared/Modal';
import { adminTableCss } from './AdminTableStyles';

const Bundle = () => {
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockBundle, setStockBundle] = useState(null);
  const [stockAction, setStockAction] = useState('add');
  const [stockQuantity, setStockQuantity] = useState('');

  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProductQty, setSelectedProductQty] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState('');

  const [form, setForm] = useState({ name:'', description:'', products:[], services:[], bundlePrice:'', stock:'', image:'', isActive:true });
  const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const fetchBundles = useCallback(async () => {
    try { setLoading(true); setBundles((await bundleService.getAllBundles(search))||[]); }
    catch(err) { console.error(err); } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchBundles(); }, [fetchBundles]);
  useEffect(() => {
    productService.getAllProducts('').then(d=>setAvailableProducts(d||[])).catch(()=>{});
    serviceService.getAllServices('').then(d=>setAvailableServices(d||[])).catch(()=>{});
  }, []);

  const filtered = bundles.filter(b => statusFilter===''||(statusFilter==='active'&&b.isActive)||(statusFilter==='inactive'&&!b.isActive));

  const openCreate = () => {
    setEditingBundle(null);
    setForm({ name:'', description:'', products:[], services:[], bundlePrice:'', stock:'', image:'', isActive:true });
    setPhotoPreview(null); setIsModalOpen(true);
  };
  const openEdit = (b) => {
    setEditingBundle(b);
    setForm({ name:b.name, description:b.description, products:b.products||[], services:b.services||[], bundlePrice:b.bundlePrice, stock:b.stock, image:b.image||'', isActive:b.isActive });
    setPhotoPreview(b.image||null); setIsModalOpen(true);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    try { const url = await productService.uploadFile(file); setForm(p=>({...p,image:url})); setPhotoPreview(url); }
    catch { alert('Gagal upload foto'); }
  };

  const addProduct = () => {
    if (!selectedProductId) return alert('Pilih produk terlebih dahulu');
    const product = availableProducts.find(p=>p.id===selectedProductId);
    if (!product) return;
    if (form.products.some(p=>p.productId===selectedProductId)) return alert('Produk sudah ditambahkan');
    setForm(p=>({...p, products:[...p.products,{productId:product.id,productName:product.name,quantity:selectedProductQty}]}));
    setSelectedProductId(''); setSelectedProductQty(1);
  };

  const addService = () => {
    if (!selectedServiceId) return alert('Pilih service terlebih dahulu');
    const service = availableServices.find(s=>s.id===selectedServiceId);
    if (!service) return;
    if (form.services.some(s=>s.serviceId===selectedServiceId)) return alert('Service sudah ditambahkan');
    setForm(p=>({...p, services:[...p.services,{serviceId:service.id,serviceName:service.name}]}));
    setSelectedServiceId('');
  };

  const removeProduct = (id) => setForm(p=>({...p,products:p.products.filter(x=>x.productId!==id)}));
  const removeService = (id) => setForm(p=>({...p,services:p.services.filter(x=>x.serviceId!==id)}));

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Nama bundle wajib diisi');
    if (form.products.length===0&&form.services.length===0) return alert('Bundle harus memiliki minimal 1 produk atau service');
    if (!form.bundlePrice||form.bundlePrice<=0) return alert('Harga bundle harus lebih dari 0');
    try {
      if(editingBundle) await bundleService.updateBundle(editingBundle.id, form);
      else await bundleService.createBundle(form);
      setIsModalOpen(false); fetchBundles();
    } catch(err) { alert(err.response?.data?.error||'Gagal menyimpan bundle'); }
  };

  const handleDelete = async () => {
    try { await bundleService.deleteBundle(deleteTarget.id); setDeleteOpen(false); setDeleteTarget(null); fetchBundles(); }
    catch { alert('Gagal menghapus bundle'); }
  };

  const openStockModal = (bundle) => {
    setStockBundle(bundle);
    setStockAction('add');
    setStockQuantity('');
    setStockModalOpen(true);
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    if (!stockBundle || !stockQuantity) return;
    try {
      const quantity = parseInt(stockQuantity);
      if (stockAction === 'remove' && quantity > stockBundle.stock) {
        alert('Stok pengurangan tidak boleh melebihi stok saat ini');
        return;
      }
      const newStock = stockAction === 'add' 
        ? stockBundle.stock + quantity 
        : stockBundle.stock - quantity;
      await bundleService.updateStock(stockBundle.id, newStock, 'set');
      setStockModalOpen(false);
      setStockBundle(null);
      setStockQuantity('');
      fetchBundles();
      alert('Stok paket berhasil diperbarui');
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal memperbarui stok paket');
    }
  };

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <>
      <style>{adminTableCss}</style>
      <div className="adm-page">
        <div className="adm-pg-header adm-a1">
          <div>
            <p className="adm-pg-eyebrow">Manajemen</p>
            <h1 className="adm-pg-title">Paket</h1>
            <p className="adm-pg-sub">Kelola paket bundling produk & layanan</p>
          </div>
          <button className="adm-add-btn" onClick={openCreate}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Tambah Paket
          </button>
        </div>

        <div className="adm-filter-bar adm-a2">
          <input className="adm-search" type="text" placeholder="Cari paket..." value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="adm-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>

        <div className="adm-table-panel adm-a3">
          <div className="adm-table-head">
            <span className="adm-table-head-title">Daftar Paket</span>
            {!loading && <span className="adm-count">{filtered.length} paket</span>}
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="adm-table">
              <thead><tr><th>Foto</th><th>Nama Paket</th><th>Harga</th><th>Stok</th><th>Produk / Layanan</th><th>Status</th><th className="center">Aksi</th></tr></thead>
              <tbody>
                {loading ? Array.from({length:3}).map((_,i)=>(<tr key={i}>{[40,120,90,60,100,60,80].map((w,j)=><td key={j}><span className="skel" style={{width:w,height:13}}/></td>)}</tr>))
                : filtered.length===0 ? <tr><td colSpan="7"><div className="adm-empty">Tidak ada paket.</div></td></tr>
                : filtered.map(b=>(
                  <tr key={b.id}>
                    <td><div className="adm-thumb">{b.image?<img src={bundleService.getImageUrl(b.image)} alt={b.name} onError={e=>{e.target.style.display='none';}}/>:b.name.charAt(0).toUpperCase()}</div></td>
                    <td className="adm-td-name">{b.name}</td>
                    <td className="adm-td-gold">{formatRp(b.bundlePrice)}</td>
                    <td><span className={`adm-badge ${b.stock<5?'stock-low':'stock-ok'}`}>{b.stock} pcs</span></td>
                    <td><span style={{color:'var(--t2)'}}>{b.products.length} produk, {b.services.length} layanan</span></td>
                    <td><span className={`adm-badge ${b.isActive?'active':'inactive'}`}>{b.isActive?'Aktif':'Nonaktif'}</span></td>
                    <td className="adm-td-center">
                      <div className="adm-action-cell">
                        <button className="adm-btn-edit" onClick={()=>openEdit(b)}>Edit</button>
                        <button className="adm-btn-stock" onClick={()=>openStockModal(b)} style={{backgroundColor:'#3B82F6',color:'white',padding:'6px 12px',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'11px',fontWeight:'600',marginLeft:'4px'}}>Stok</button>
                        <button className="adm-btn-delete" onClick={()=>{setDeleteTarget(b);setDeleteOpen(true);}}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title={editingBundle?'Edit Paket':'Tambah Paket Baru'}>
          <div className="adm-modal-body">
            <div className="adm-field"><label className="adm-field-label">Nama Paket</label><input className="adm-field-input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Nama paket..."/></div>
            <div className="adm-field"><label className="adm-field-label">Deskripsi</label><textarea className="adm-field-input" rows={2} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Deskripsi..." style={{resize:'vertical'}}/></div>
            <div className="adm-field-row">
              <div className="adm-field"><label className="adm-field-label">Harga Paket (Rp)</label><input className="adm-field-input" type="number" value={form.bundlePrice} onChange={e=>set('bundlePrice',parseInt(e.target.value)||0)} placeholder="0"/></div>
              <div className="adm-field"><label className="adm-field-label">Stok</label><input className="adm-field-input" type="number" value={form.stock} onChange={e=>set('stock',parseInt(e.target.value)||0)} placeholder="0"/></div>
            </div>
            <div className="adm-field">
              <label className="adm-field-label">Foto Paket</label>
              {photoPreview && <img className="adm-preview" src={bundleService.getImageUrl(photoPreview)} alt="preview" onError={e=>{e.target.style.display='none';}}/>}
              <input className="adm-field-input" type="file" accept="image/*" onChange={handleFile} style={{paddingTop:6}}/>
            </div>
            <label className="adm-toggle-row" htmlFor="bndl-active">
              <input id="bndl-active" type="checkbox" checked={form.isActive} onChange={e=>set('isActive',e.target.checked)}/>
              <span className="adm-toggle-label">Paket aktif</span>
            </label>

            <div className="adm-hr"/>
            <p className="adm-section-title">Produk dalam Paket</p>
            {form.products.map(p=>(
              <div key={p.productId} className="adm-item-row">
                <span>{p.productName} <span style={{color:'var(--t3)'}}>×{p.quantity}</span></span>
                <button className="adm-item-remove" onClick={()=>removeProduct(p.productId)}>Hapus</button>
              </div>
            ))}
            <div className="adm-add-row">
              <select className="adm-field-input" style={{flex:1}} value={selectedProductId} onChange={e=>setSelectedProductId(e.target.value)}>
                <option value="">Pilih produk...</option>
                {availableProducts.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input className="adm-field-input" type="number" min="1" value={selectedProductQty} onChange={e=>setSelectedProductQty(Math.max(1,parseInt(e.target.value)||1))} style={{width:64}} placeholder="Qty"/>
              <button type="button" className="adm-inline-add-btn" onClick={addProduct}>Tambah</button>
            </div>

            <div className="adm-hr"/>
            <p className="adm-section-title">Layanan dalam Paket</p>
            {form.services.map(s=>(
              <div key={s.serviceId} className="adm-item-row">
                <span>{s.serviceName}</span>
                <button className="adm-item-remove" onClick={()=>removeService(s.serviceId)}>Hapus</button>
              </div>
            ))}
            <div className="adm-add-row">
              <select className="adm-field-input" style={{flex:1}} value={selectedServiceId} onChange={e=>setSelectedServiceId(e.target.value)}>
                <option value="">Pilih layanan...</option>
                {availableServices.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button type="button" className="adm-inline-add-btn" onClick={addService}>Tambah</button>
            </div>
          </div>
          <div className="adm-modal-footer">
            <button className="adm-modal-cancel" onClick={()=>setIsModalOpen(false)}>Batal</button>
            <button className="adm-modal-save" onClick={handleSave}>Simpan</button>
          </div>
        </Modal>

        <Modal isOpen={deleteOpen} onClose={()=>setDeleteOpen(false)} title="Hapus Paket">
          <p className="adm-delete-msg">Hapus paket <span className="adm-delete-name">"{deleteTarget?.name}"</span>?</p>
          <div className="adm-modal-footer">
            <button className="adm-modal-cancel" onClick={()=>setDeleteOpen(false)}>Batal</button>
            <button className="adm-modal-delete-confirm" onClick={handleDelete}>Hapus</button>
          </div>
        </Modal>

        {/* Stock Management Modal */}
        <Modal isOpen={stockModalOpen} onClose={()=>setStockModalOpen(false)} title={`Kelola Stok - ${stockBundle?.name}`}>
          <form onSubmit={handleStockUpdate}>
            <div className="adm-modal-body">
              <div style={{marginBottom:'20px',padding:'12px',backgroundColor:'#F3F4F6',borderRadius:'8px'}}>
                <p style={{fontSize:'14px',color:'#666',margin:'0 0 4px 0'}}>Stok Saat Ini</p>
                <p style={{fontSize:'24px',fontWeight:'700',color:'#1F2937',margin:'0'}}>{stockBundle?.stock || 0} pcs</p>
              </div>
              <div style={{marginBottom:'20px'}}>
                <label style={{display:'block',marginBottom:'8px',fontSize:'14px',fontWeight:'600',color:'#333'}}>Aksi</label>
                <div style={{display:'flex',gap:'8px'}}>
                  <button type="button" onClick={()=>setStockAction('add')} style={{flex:1,padding:'10px',borderRadius:'6px',border:stockAction==='add'?'2px solid #3B82F6':'1px solid #D1D5DB',backgroundColor:stockAction==='add'?'#EFF6FF':'white',color:stockAction==='add'?'#3B82F6':'#666',fontWeight:'600',cursor:'pointer'}}>➕ Tambah Stok</button>
                  <button type="button" onClick={()=>setStockAction('remove')} style={{flex:1,padding:'10px',borderRadius:'6px',border:stockAction==='remove'?'2px solid #EF4444':'1px solid #D1D5DB',backgroundColor:stockAction==='remove'?'#FEF2F2':'white',color:stockAction==='remove'?'#EF4444':'#666',fontWeight:'600',cursor:'pointer'}}>➖ Kurangi Stok</button>
                </div>
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Jumlah {stockAction==='add'?'Tambahan':'Pengurangan'}</label>
                <input className="adm-field-input" type="number" required value={stockQuantity} onChange={e=>setStockQuantity(e.target.value)} placeholder="0" min="1" max={stockAction==='remove'?stockBundle?.stock:9999} />
              </div>
              <div style={{marginTop:'20px',padding:'12px',backgroundColor:'#F0FDF4',borderRadius:'8px',borderLeft:'4px solid #10B981'}}>
                <p style={{fontSize:'13px',color:'#065F46',margin:'0'}}>Stok baru: <strong>{stockAction==='add'?parseInt(stockQuantity||0)+parseInt(stockBundle?.stock||0):parseInt(stockBundle?.stock||0)-parseInt(stockQuantity||0)}</strong> pcs</p>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button type="button" className="adm-modal-cancel" onClick={()=>setStockModalOpen(false)}>Batal</button>
              <button type="submit" className="adm-modal-save">Perbarui Stok</button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Bundle;