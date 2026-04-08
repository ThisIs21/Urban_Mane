// ============================================================
// Services.jsx
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import serviceService from '../../services/serviceService';
import productService from '../../services/productService';
import Modal from '../../components/shared/Modal';
import { adminTableCss } from './AdminTableStyles';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingSvc, setEditingSvc] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const [form, setForm] = useState({ name:'', price:'', duration:'', category:'', image:'', requiredProducts:[], isActive:true });
  const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const fetchServices = useCallback(async () => {
    try { setLoading(true); setServices((await serviceService.getAllServices(search)) || []); }
    catch(err) { console.error(err); } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchServices(); }, [fetchServices]);
  useEffect(() => { productService.getAllProducts('').then(d=>setAllProducts(d||[])).catch(()=>{}); }, []);

  const openCreate = () => {
    setEditingSvc(null);
    setForm({ name:'', price:'', duration:'', category:'', image:'', requiredProducts:[], isActive:true });
    setPhotoPreview(null); setIsModalOpen(true);
  };
  const openEdit = (s) => {
    setEditingSvc(s);
    setForm({ name:s.name, price:s.price, duration:s.duration, category:s.category||'', image:s.image||'', requiredProducts:s.requiredProducts||[], isActive:s.isActive });
    setPhotoPreview(s.image||null); setIsModalOpen(true);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { const url = await serviceService.uploadFile(file); setForm(p=>({...p,image:url})); setPhotoPreview(url); }
    catch { alert('Gagal upload foto'); }
  };

  const addProduct = () => setForm(p=>({...p, requiredProducts:[...p.requiredProducts,{productId:'',productName:'',quantity:1}]}));
  const removeProduct = (i) => setForm(p=>({...p, requiredProducts:p.requiredProducts.filter((_,j)=>j!==i)}));
  const updateProductRow = (i, field, value) => setForm(p=>{
    const rp=[...p.requiredProducts]; rp[i]={...rp[i],[field]:value};
    if(field==='productId'){ const prod=allProducts.find(x=>x.id===value); rp[i].productName=prod?.name||''; }
    return {...p,requiredProducts:rp};
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {...form, price:Number(form.price), duration:Number(form.duration)};
      if(editingSvc) await serviceService.updateService(editingSvc.id, payload);
      else await serviceService.createService(payload);
      setIsModalOpen(false); fetchServices();
    } catch(err) { alert(err.response?.data?.error||'Terjadi kesalahan'); }
  };

  const handleDelete = async () => {
    try { await serviceService.deleteService(deleteTarget.id); setDeleteOpen(false); setDeleteTarget(null); fetchServices(); }
    catch { alert('Gagal menghapus service'); }
  };

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <>
      <style>{adminTableCss}</style>
      <div className="adm-page">
        <div className="adm-pg-header adm-a1">
          <div>
            <p className="adm-pg-eyebrow">Manajemen</p>
            <h1 className="adm-pg-title">Layanan</h1>
            <p className="adm-pg-sub">Kelola service dan durasi</p>
          </div>
          <button className="adm-add-btn" onClick={openCreate}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Tambah Layanan
          </button>
        </div>

        <div className="adm-filter-bar adm-a2">
          <input className="adm-search" type="text" placeholder="Cari layanan..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>

        <div className="adm-table-panel adm-a3">
          <div className="adm-table-head">
            <span className="adm-table-head-title">Daftar Layanan</span>
            {!loading && <span className="adm-count">{services.length} layanan</span>}
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="adm-table">
              <thead>
                <tr><th>Foto</th><th>Nama</th><th>Kategori</th><th>Harga</th><th>Durasi</th><th>Produk</th><th>Status</th><th className="center">Aksi</th></tr>
              </thead>
              <tbody>
                {loading ? Array.from({length:3}).map((_,i)=>(<tr key={i}>{[40,120,80,90,60,60,60,80].map((w,j)=><td key={j}><span className="skel" style={{width:w,height:13}}/></td>)}</tr>))
                : services.length===0 ? <tr><td colSpan="8"><div className="adm-empty">Tidak ada layanan ditemukan.</div></td></tr>
                : services.map(s=>(
                  <tr key={s.id}>
                    <td><div className="adm-thumb">{s.image?<img src={serviceService.getImageUrl(s.image)} alt={s.name} onError={e=>{e.target.style.display='none';}}/>:s.name.charAt(0).toUpperCase()}</div></td>
                    <td className="adm-td-name">{s.name}</td>
                    <td>{s.category||'—'}</td>
                    <td className="adm-td-gold">{formatRp(s.price)}</td>
                    <td>{s.duration} menit</td>
                    <td>{s.requiredProducts?.length||0} item</td>
                    <td><span className={`adm-badge ${s.isActive?'active':'inactive'}`}>{s.isActive?'Aktif':'Nonaktif'}</span></td>
                    <td className="adm-td-center">
                      <div className="adm-action-cell">
                        <button className="adm-btn-edit" onClick={()=>openEdit(s)}>Edit</button>
                        <button className="adm-btn-delete" onClick={()=>{setDeleteTarget(s);setDeleteOpen(true);}}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title={editingSvc?'Edit Layanan':'Tambah Layanan Baru'}>
          <form onSubmit={handleSubmit}>
            <div className="adm-modal-body">
              <div className="adm-field"><label className="adm-field-label">Nama Layanan</label><input className="adm-field-input" required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Nama layanan..."/></div>
              <div className="adm-field-row">
                <div className="adm-field"><label className="adm-field-label">Harga (Rp)</label><input className="adm-field-input" type="number" required value={form.price} onChange={e=>set('price',e.target.value)} placeholder="0"/></div>
                <div className="adm-field"><label className="adm-field-label">Durasi (menit)</label><input className="adm-field-input" type="number" required value={form.duration} onChange={e=>set('duration',e.target.value)} placeholder="30"/></div>
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Kategori</label>
                <select className="adm-field-input" value={form.category} onChange={e=>set('category',e.target.value)}>
                  <option value="">Pilih kategori</option>
                  {['Haircut','Coloring','Beard','Styling'].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Foto Layanan</label>
                {photoPreview && <img className="adm-preview" src={serviceService.getImageUrl(photoPreview)} alt="preview" onError={e=>{e.target.style.display='none';}}/>}
                <input className="adm-field-input" type="file" accept="image/*" onChange={handleFile} style={{paddingTop:6}}/>
              </div>
              <div className="adm-hr"/>
              <p className="adm-section-title">Produk yang Dibutuhkan</p>
              {form.requiredProducts.map((rp,i)=>(
                <div key={i} style={{display:'flex',gap:8,alignItems:'center'}}>
                  <select className="adm-field-input" style={{flex:1}} value={rp.productId} onChange={e=>updateProductRow(i,'productId',e.target.value)}>
                    <option value="">Pilih produk</option>
                    {allProducts.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <input className="adm-field-input" type="number" min="1" value={rp.quantity} onChange={e=>updateProductRow(i,'quantity',Number(e.target.value))} style={{width:64}} placeholder="Qty"/>
                  <button type="button" className="adm-item-remove" onClick={()=>removeProduct(i)}>Hapus</button>
                </div>
              ))}
              <button type="button" className="adm-inline-add-btn" onClick={addProduct}>+ Tambah Produk</button>
              <label className="adm-toggle-row" htmlFor="svc-active">
                <input id="svc-active" type="checkbox" checked={form.isActive} onChange={e=>set('isActive',e.target.checked)}/>
                <span className="adm-toggle-label">Layanan aktif</span>
              </label>
            </div>
            <div className="adm-modal-footer">
              <button type="button" className="adm-modal-cancel" onClick={()=>setIsModalOpen(false)}>Batal</button>
              <button type="submit" className="adm-modal-save">Simpan</button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={deleteOpen} onClose={()=>setDeleteOpen(false)} title="Hapus Layanan">
          <p className="adm-delete-msg">Hapus layanan <span className="adm-delete-name">"{deleteTarget?.name}"</span>?</p>
          <div className="adm-modal-footer">
            <button className="adm-modal-cancel" onClick={()=>setDeleteOpen(false)}>Batal</button>
            <button className="adm-modal-delete-confirm" onClick={handleDelete}>Hapus</button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Services;