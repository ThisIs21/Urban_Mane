import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import Modal from '../../components/shared/Modal';
import { adminTableCss } from './adminTableStyles';

const ROLES = ['admin', 'owner', 'cashier', 'barber'];
const roleCls = { admin:'role-admin', owner:'role-owner', cashier:'role-cashier', barber:'role-barber' };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [form, setForm] = useState({ name:'', email:'', password:'', role:'cashier', phone:'', isActive:true, photoUrl:'' });

  const fetchUsers = async () => {
    try { setLoading(true); setUsers((await userService.getAllUsers(search))||[]); }
    catch(err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search]);
  useEffect(() => {
    setFiltered(roleFilter ? users.filter(u=>u.role===roleFilter) : users);
  }, [users, roleFilter]);

  const openCreate = () => {
    setCurrentUser(null);
    setForm({ name:'', email:'', password:'', role:'cashier', phone:'', isActive:true, photoUrl:'' });
    setPhotoPreview(null); setIsModalOpen(true);
  };
  const openEdit = (u) => {
    setCurrentUser(u);
    setForm({ name:u.name, email:u.email, password:'', role:u.role, phone:u.phone||'', isActive:u.isActive!==undefined?u.isActive:true, photoUrl:u.photoUrl||'' });
    setPhotoPreview(u.photoUrl||null); setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    try {
      const fd = new FormData(); fd.append('file',file);
      const response = await userService.uploadPhoto(fd);
      const url = response.url;
      setForm(p=>({...p,photoUrl:url}));
      setPhotoPreview(url);
    } catch { alert('Gagal upload foto'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(currentUser) await userService.updateUser(currentUser.id, form);
      else await userService.createUser(form);
      setIsModalOpen(false); fetchUsers();
    } catch(err) { alert(err.response?.data?.error||'Terjadi kesalahan'); }
  };

  const handleDelete = async () => {
    try { await userService.deleteUser(deleteTarget.id); setDeleteOpen(false); setDeleteTarget(null); fetchUsers(); }
    catch { alert('Gagal menghapus pengguna'); }
  };

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <>
      <style>{adminTableCss}</style>
      <div className="adm-page">

        <div className="adm-pg-header adm-a1">
          <div>
            <p className="adm-pg-eyebrow">Manajemen</p>
            <h1 className="adm-pg-title">Pengguna</h1>
            <p className="adm-pg-sub">Kelola akun staf & admin</p>
          </div>
          <button className="adm-add-btn" onClick={openCreate}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
            Tambah Pengguna
          </button>
        </div>

        <div className="adm-filter-bar adm-a2">
          <input className="adm-search" type="text" placeholder="Cari nama atau email..." value={search} onChange={e=>setSearch(e.target.value)} />
          <select className="adm-select" value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}>
            <option value="">Semua Role</option>
            {ROLES.map(r=><option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
          </select>
        </div>

        <div className="adm-table-panel adm-a3">
          <div className="adm-table-head">
            <span className="adm-table-head-title">Daftar Pengguna</span>
            {!loading && <span className="adm-count">{filtered.length} pengguna</span>}
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="adm-table">
              <thead><tr><th>Foto</th><th>Nama</th><th>Email</th><th>Role</th><th>Telepon</th><th>Status</th><th className="center">Aksi</th></tr></thead>
              <tbody>
                {loading ? Array.from({length:4}).map((_,i)=>(<tr key={i}>{[40,120,140,70,90,60,80].map((w,j)=><td key={j}><span className="skel" style={{width:w,height:13}}/></td>)}</tr>))
                : filtered.length===0 ? <tr><td colSpan="7"><div className="adm-empty">Tidak ada pengguna.</div></td></tr>
                : filtered.map(u=>{
                  const avatarUrl = u.photoUrl ? userService.getImageUrl(u.photoUrl) : null;
                  const initials  = u.name ? u.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase() : '?';
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="adm-thumb round">
                          {avatarUrl
                            ? <img src={avatarUrl} alt={u.name} onError={e=>{e.target.style.display='none';}}/>
                            : initials}
                        </div>
                      </td>
                      <td className="adm-td-name">{u.name}</td>
                      <td style={{color:'var(--t2)',fontSize:12}}>{u.email}</td>
                      <td><span className={`adm-badge ${roleCls[u.role]||''}`}>{u.role}</span></td>
                      <td>{u.phone||'—'}</td>
                      <td><span className={`adm-badge ${u.isActive?'active':'inactive'}`}>{u.isActive?'Aktif':'Nonaktif'}</span></td>
                      <td className="adm-td-center">
                        <div className="adm-action-cell">
                          <button className="adm-btn-edit" onClick={()=>openEdit(u)}>Edit</button>
                          <button className="adm-btn-delete" onClick={()=>{setDeleteTarget(u);setDeleteOpen(true);}}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} title={currentUser?'Edit Pengguna':'Tambah Pengguna Baru'}>
          <form onSubmit={handleSubmit}>
            <div className="adm-modal-body">
              <div className="adm-field"><label className="adm-field-label">Nama</label><input className="adm-field-input" required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Nama lengkap..."/></div>
              <div className="adm-field"><label className="adm-field-label">Email</label><input className="adm-field-input" type="email" required value={form.email} onChange={e=>set('email',e.target.value)} placeholder="email@domain.com"/></div>
              <div className="adm-field">
                <label className="adm-field-label">Password {currentUser && '(kosongkan jika tidak diubah)'}</label>
                <input className="adm-field-input" type="password" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="••••••••"/>
              </div>
              <div className="adm-field-row">
                <div className="adm-field">
                  <label className="adm-field-label">Role</label>
                  <select className="adm-field-input" value={form.role} onChange={e=>set('role',e.target.value)}>
                    {ROLES.map(r=><option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                  </select>
                </div>
                <div className="adm-field"><label className="adm-field-label">Telepon</label><input className="adm-field-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="08xx..."/></div>
              </div>
              <div className="adm-field">
                <label className="adm-field-label">Foto Profil</label>
                {photoPreview && (
                  <img
                    className="adm-preview round"
                    src={userService.getImageUrl(photoPreview)}
                    alt="preview"
                    onError={e=>{e.target.style.display='none';}}
                  />
                )}
                <input className="adm-field-input" type="file" accept="image/*" onChange={handlePhotoUpload} style={{paddingTop:6}}/>
              </div>
              <label className="adm-toggle-row" htmlFor="usr-active">
                <input id="usr-active" type="checkbox" checked={form.isActive} onChange={e=>set('isActive',e.target.checked)}/>
                <span className="adm-toggle-label">Akun aktif</span>
              </label>
            </div>
            <div className="adm-modal-footer">
              <button type="button" className="adm-modal-cancel" onClick={()=>setIsModalOpen(false)}>Batal</button>
              <button type="submit" className="adm-modal-save">Simpan</button>
            </div>
          </form>
        </Modal>

        {/* Delete Modal */}
        <Modal isOpen={isDeleteOpen} onClose={()=>setDeleteOpen(false)} title="Hapus Pengguna">
          <p className="adm-delete-msg">Hapus pengguna <span className="adm-delete-name">"{deleteTarget?.name}"</span>? Tindakan ini tidak dapat dibatalkan.</p>
          <div className="adm-modal-footer">
            <button className="adm-modal-cancel" onClick={()=>setDeleteOpen(false)}>Batal</button>
            <button className="adm-modal-delete-confirm" onClick={handleDelete}>Hapus</button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Users;