import { useState, useEffect } from 'react';
// use relative path since Vite has no alias configured
import userService from '../../services/userService';
import Modal from '../../components/shared/Modal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Untuk Edit
  const [deleteTarget, setDeleteTarget] = useState(null); // Untuk Delete

  // Form Data
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'cashier', phone: ''
  });

  // Fetch Data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers(search);
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      alert("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  // refetch whenever the search query changes
  useEffect(() => {
    fetchUsers();
  }, [search]);

  // Handlers
  const handleOpenCreate = () => {
    setCurrentUser(null); // Reset current user
    setFormData({ name: '', email: '', password: '', role: 'cashier', phone: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Password dikosongkan saat edit
      role: user.role,
      phone: user.phone || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        // Update
        await userService.updateUser(currentUser.id, formData);
        alert("User berhasil diupdate!");
      } else {
        // Create
        await userService.createUser(formData);
        alert("User berhasil dibuat!");
      }
      setIsModalOpen(false);
      fetchUsers(); // Refresh data
    } catch (err) {
      alert(err.response?.data?.error || "Terjadi kesalahan");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await userService.deleteUser(deleteTarget.id);
      alert("User berhasil dihapus");
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      alert("Gagal menghapus user");
    }
  };

  // Role Badge Colors
  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-gold text-black';
      case 'owner': return 'bg-purple-600 text-white';
      case 'cashier': return 'bg-blue-600 text-white';
      case 'barber': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users & Staff Management</h1>
          <p style={{ color: 'var(--color-muted)' }}>Kelola akun pengguna sistem</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
          style={{ backgroundColor: 'var(--color-gold)', color: 'black' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add User
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-lg border focus:outline-none"
          style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'white' }}
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <table className="w-full text-left">
          <thead style={{ backgroundColor: 'var(--color-secondary)' }}>
            <tr className="border-b border-border" style={{ borderColor: 'var(--color-border)' }}>
              <th className="p-4 text-xs uppercase" style={{ color: 'var(--color-muted)' }}>Name</th>
              <th className="p-4 text-xs uppercase" style={{ color: 'var(--color-muted)' }}>Email</th>
              <th className="p-4 text-xs uppercase" style={{ color: 'var(--color-muted)' }}>Role</th>
              <th className="p-4 text-xs uppercase" style={{ color: 'var(--color-muted)' }}>Phone</th>
              <th className="p-4 text-xs uppercase text-center" style={{ color: 'var(--color-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center p-8" style={{ color: 'var(--color-muted)' }}>Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-8" style={{ color: 'var(--color-muted)' }}>No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-hover transition-colors" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--color-gold)', color: 'black' }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm" style={{ color: 'var(--color-muted)' }}>{user.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm" style={{ color: 'var(--color-muted)' }}>{user.phone || '-'}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleOpenEdit(user)} className="p-2 rounded hover:bg-blue-600/20 transition-colors" style={{ color: '#3b82f6' }} title="Edit">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => { setDeleteTarget(user); setDeleteOpen(true); }} className="p-2 rounded hover:bg-red-600/20 transition-colors" style={{ color: 'var(--color-danger)' }} title="Delete">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentUser ? "Edit User" : "Create New User"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required
              className="w-full p-2 rounded border focus:outline-none focus:border-gold"
              style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required
              className="w-full p-2 rounded border focus:outline-none focus:border-gold"
              style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Password</label>
            <input 
              type="password" 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              placeholder={currentUser ? "Kosongkan jika tidak ganti" : ""}
              required={!currentUser} // Wajib jika create, tidak wajib jika edit
              className="w-full p-2 rounded border focus:outline-none focus:border-gold"
              style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Role</label>
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})} 
              className="w-full p-2 rounded border focus:outline-none focus:border-gold"
              style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
            >
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
              <option value="cashier">Cashier</option>
              <option value="barber">Barber</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Phone</label>
            <input 
              type="text" 
              value={formData.phone} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              className="w-full p-2 rounded border focus:outline-none focus:border-gold"
              style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded border border-border hover:bg-hover" style={{ color: 'white', borderColor: 'var(--color-border)' }}>Cancel</button>
            <button type="submit" className="flex-1 py-2 rounded font-semibold" style={{ backgroundColor: 'var(--color-gold)', color: 'black' }}>
              {currentUser ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Delete">
        <div className="text-center">
          <p className="mb-6" style={{ color: 'var(--color-muted)' }}>
            Yakin ingin menghapus user <strong className="text-white">{deleteTarget?.name}</strong>?
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteOpen(false)} className="flex-1 py-2 rounded border" style={{ color: 'white', borderColor: 'var(--color-border)' }}>Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700">Delete</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Users;