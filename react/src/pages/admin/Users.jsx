import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import Modal from '../../components/shared/Modal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'cashier', phone: '', isActive: true, photoUrl: ''
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const roles = ['admin', 'owner', 'cashier', 'barber'];

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

  useEffect(() => {
    fetchUsers();
  }, [search]);

  // Filter logic
  useEffect(() => {
    let filtered = users;
    if (roleFilter) {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    setFilteredUsers(filtered);
  }, [users, roleFilter]);

  const handleOpenCreate = () => {
    setCurrentUser(null);
    setFormData({ name: '', email: '', password: '', role: 'cashier', phone: '', isActive: true, photoUrl: '' });
    setPhotoPreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || '',
      isActive: user.isActive !== undefined ? user.isActive : true,
      photoUrl: user.photoUrl || ''
    });
    setPhotoPreview(user.photoUrl || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentUser) {
        await userService.updateUser(currentUser.id, formData);
        alert("User berhasil diupdate!");
      } else {
        await userService.createUser(formData);
        alert("User berhasil dibuat!");
      }
      setIsModalOpen(false);
      fetchUsers();
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

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-amber-500 text-black';
      case 'owner': return 'bg-purple-600 text-white';
      case 'cashier': return 'bg-blue-600 text-white';
      case 'barber': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  // ========== PHOTO UPLOAD HANDLER ==========
  // When user selects a file from input, upload it to backend
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Send to backend /upload endpoint via userService
      const response = await userService.uploadPhoto(formData);
      console.log('Upload response:', response);  // DEBUG
      
      // Backend returns URL like "/images/products/photo_1234.jpg"
      // Save to formData (will be sent to database)
      const url = response.url;
      console.log('URL from upload:', url);  // DEBUG
      setFormData(prev => ({ ...prev, photoUrl: url }));
      
      // Show preview - store the relative URL, it will be converted to full URL by getImageUrl() in display
      setPhotoPreview(url);
    } catch (err) {
      alert('Gagal upload foto');
      console.error('Upload error:', err);  // DEBUG
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Users & Staff</h1>
          <p className="text-gray-400 mt-1">Manage system users and staff accounts</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
          style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add User
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border transition-all"
          style={{ 
            backgroundColor: '#1A1A1A',
            borderColor: '#333333',
            color: '#F0F0F0'
          }}
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border transition-all"
          style={{
            backgroundColor: '#1A1A1A',
            borderColor: '#333333',
            color: '#F0F0F0'
          }}
        >
          <option value="">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* LOADING */}
      {loading && <p className="text-center text-gray-400">Loading...</p>}

      {/* TABLE */}
      {!loading && filteredUsers.length > 0 ? (
        <div className="rounded-xl overflow-hidden shadow-2xl border" style={{ borderColor: '#333333' }}>
          <div className="overflow-x-auto" style={{ backgroundColor: '#1A1A1A' }}>
            <table className="w-full">
              <thead style={{ backgroundColor: '#0F0F0F' }}>
                <tr className="border-b" style={{ borderColor: '#333333' }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Photo</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: '#D4AF37' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  console.log('Rendering users, count:', filteredUsers.length);  // DEBUG
                  if (filteredUsers.length > 0) {
                    console.log('First user:', filteredUsers[0]);  // DEBUG
                    console.log('First user photoUrl:', filteredUsers[0].photoUrl);  // DEBUG
                  }
                  return filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="border-b hover:opacity-75 transition-all" style={{ borderColor: '#333333' }}>
                    {/* PHOTO COLUMN - Display user photo or initial */}
                    <td className="px-6 py-4">
                      {user.photoUrl ? (
                        // IMPORTANT: userService.getImageUrl() converts relative paths to full backend URLs
                        // Example: "/images/products/photo.jpg" → "http://localhost:8080/images/products/photo.jpg"
                        <img 
                          src={userService.getImageUrl(user.photoUrl)} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover" 
                          onError={(e) => {
                            console.log('Image load failed for:', user.photoUrl, 'Full URL:', userService.getImageUrl(user.photoUrl));
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        // If no photo, show initial letter
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-200 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{user.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="px-3 py-1 rounded text-sm font-medium transition-all mr-2"
                        style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => { setDeleteTarget(user); setDeleteOpen(true); }}
                        className="px-3 py-1 rounded text-sm font-medium transition-all bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && <p className="text-center text-gray-400 py-8">No users found</p>
      )}

      {/* CREATE/EDIT MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentUser ? 'Edit User' : 'Add New User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border" style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 rounded-lg border" style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password {currentUser && '(leave empty to keep current)'}</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 rounded-lg border" style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 rounded-lg border" style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}}>
              {roles.map(role => (<option key={role} value={role}>{role}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 rounded-lg border" style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Photo</label>
            {/* IMPORTANT: Photo preview - use userService.getImageUrl() to get full URL */}
            {photoPreview && (
              <img 
                src={userService.getImageUrl(photoPreview)} 
                alt="Preview" 
                className="w-20 h-20 rounded-lg mb-2 object-cover" 
                onError={(e) => {
                  console.log('Preview image error:', photoPreview, 'Full URL:', userService.getImageUrl(photoPreview));
                  e.target.style.display = 'none';
                }}
              />
            )}
            <input type="file" onChange={handlePhotoUpload} className="w-full" />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="rounded" />
            <span className="text-sm font-medium text-gray-300">Active</span>
          </label>
          <div className="flex gap-2 pt-4 border-t" style={{borderColor: '#333333'}}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg border transition-all" style={{borderColor: '#333333', color: '#F0F0F0'}}>Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all" style={{backgroundColor: '#D4AF37', color: '#0F0F0F'}}>Save</button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Delete">
        <p className="text-gray-300 mb-6">Are you sure you want to delete user <strong>{deleteTarget?.name}</strong>?</p>
        <div className="flex gap-2">
          <button onClick={() => setDeleteOpen(false)} className="flex-1 px-4 py-2 rounded-lg border transition-all" style={{borderColor: '#333333', color: '#F0F0F0'}}>Cancel</button>
          <button onClick={handleDelete} className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all">Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default Users;