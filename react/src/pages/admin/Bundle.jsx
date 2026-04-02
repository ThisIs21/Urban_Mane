import { useState, useEffect } from 'react';
import bundleService from '../../services/bundleService';
import productService from '../../services/productService';
import serviceService from '../../services/serviceService';
import Modal from '../../components/shared/Modal';

const Bundle = () => {
  // ========== BUNDLE STATE ==========
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    products: [],
    services: [],
    bundlePrice: '',
    stock: '',
    image: '',
    isActive: true
  });

  // ========== AVAILABLE PRODUCTS & SERVICES ==========
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);

  // ========== SELECTED PRODUCTS & SERVICES ==========
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProductQty, setSelectedProductQty] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  
  // ========== IMAGE PREVIEW ==========
  const [photoPreview, setPhotoPreview] = useState(null);

  // ========== FETCH FUNCTIONS ==========

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const data = await bundleService.getAllBundles(search);
      setBundles(data || []);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil data bundle');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProducts = async () => {
    try {
      setProductsLoading(true);
      const data = await productService.getAllProducts('');
      setAvailableProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchAvailableServices = async () => {
    try {
      setServicesLoading(true);
      const data = await serviceService.getAllServices('');
      setAvailableServices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
    fetchAvailableProducts();
    fetchAvailableServices();
  }, [search]);

  // ========== FILTER FUNCTION ==========
  const getFilteredBundles = () => {
    return bundles.filter(bundle => {
      const matchesStatus = statusFilter === '' || 
        (statusFilter === 'active' && bundle.isActive) || 
        (statusFilter === 'inactive' && !bundle.isActive);
      return matchesStatus;
    });
  };

  // ========== ADD/REMOVE PRODUCTS & SERVICES ==========

  const addProductToBundle = () => {
    if (!selectedProductId) {
      alert('Pilih produk terlebih dahulu');
      return;
    }

    const product = availableProducts.find(p => p.id === selectedProductId);
    if (!product) return;

    const alreadyExists = formData.products.some(p => p.productId === selectedProductId);
    if (alreadyExists) {
      alert('Produk sudah ditambahkan');
      return;
    }

    setFormData(prev => ({
      ...prev,
      products: [...prev.products, {
        productId: product.id,
        productName: product.name,
        quantity: selectedProductQty
      }]
    }));

    setSelectedProductId('');
    setSelectedProductQty(1);
  };

  const removeProductFromBundle = (productId) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.productId !== productId)
    }));
  };

  const addServiceToBundle = () => {
    if (!selectedServiceId) {
      alert('Pilih service terlebih dahulu');
      return;
    }

    const service = availableServices.find(s => s.id === selectedServiceId);
    if (!service) return;

    const alreadyExists = formData.services.some(s => s.serviceId === selectedServiceId);
    if (alreadyExists) {
      alert('Service sudah ditambahkan');
      return;
    }

    setFormData(prev => ({
      ...prev,
      services: [...prev.services, {
        serviceId: service.id,
        serviceName: service.name
      }]
    }));

    setSelectedServiceId('');
  };

  const removeServiceFromBundle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.serviceId !== serviceId)
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await productService.uploadFile(file);
      setFormData(prev => ({...prev, image: url}));
      setPhotoPreview(url);
    } catch (err) {
      alert('Gagal upload foto');
    }
  };

  // ========== CRUD OPERATIONS ==========

  const handleOpenModal = (bundle = null) => {
    if (bundle) {
      setEditingBundle(bundle);
      setFormData({
        name: bundle.name,
        description: bundle.description,
        products: bundle.products || [],
        services: bundle.services || [],
        bundlePrice: bundle.bundlePrice,
        stock: bundle.stock,
        image: bundle.image || '',
        isActive: bundle.isActive
      });
      setPhotoPreview(bundle.image || null);
    } else {
      setEditingBundle(null);
      setFormData({
        name: '',
        description: '',
        products: [],
        services: [],
        bundlePrice: '',
        stock: '',
        image: '',
        isActive: true
      });
      setPhotoPreview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBundle(null);
  };

  const handleSaveBundle = async () => {
    if (!formData.name.trim()) {
      alert('Nama bundle wajib diisi');
      return;
    }

    if (formData.products.length === 0 && formData.services.length === 0) {
      alert('Bundle harus memiliki minimal 1 produk atau service');
      return;
    }

    if (!formData.bundlePrice || formData.bundlePrice <= 0) {
      alert('Harga bundle harus lebih dari 0');
      return;
    }

    if (!formData.stock || formData.stock < 0) {
      alert('Stok tidak boleh negatif');
      return;
    }

    try {
      if (editingBundle) {
        await bundleService.updateBundle(editingBundle.id, formData);
        alert('Bundle berhasil diperbarui');
      } else {
        await bundleService.createBundle(formData);
        alert('Bundle berhasil ditambahkan');
      }
      handleCloseModal();
      fetchBundles();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan bundle');
    }
  };

  const handleDeleteBundle = async () => {
    try {
      await bundleService.deleteBundle(deleteTarget.id);
      alert('Bundle berhasil dihapus');
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchBundles();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus bundle');
    }
  };

  return (
    <div className="space-y-6" style={{ backgroundColor: '#0F0F0F', minHeight: '100vh' }}>
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: '#D4AF37' }}>Bundle Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
          style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Tambah Bundle
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Cari bundle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border transition-all"
          style={{
            backgroundColor: '#1A1A1A',
            borderColor: '#333333',
            color: '#F0F0F0'
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border transition-all"
          style={{
            backgroundColor: '#1A1A1A',
            borderColor: '#333333',
            color: '#F0F0F0'
          }}
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && <p className="text-center py-8" style={{ color: '#999999' }}>Memuat...</p>}

      {/* BUNDLES TABLE */}
      {!loading && getFilteredBundles().length > 0 ? (
        <div className="rounded-xl overflow-hidden shadow-2xl border" style={{ borderColor: '#333333' }}>
          <div className="overflow-x-auto" style={{ backgroundColor: '#1A1A1A' }}>
            <table className="w-full">
              <thead style={{ backgroundColor: '#0F0F0F' }}>
                <tr className="border-b" style={{ borderColor: '#333333' }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Foto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Nama Bundle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Harga</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Stok</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Produk/Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: '#D4AF37' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredBundles().map(bundle => (
                  <tr key={bundle.id} className="border-b hover:opacity-75 transition-all" style={{ borderColor: '#333333' }}>
                    <td className="px-6 py-4">
                      {bundle.image ? (
                        <img 
                          src={bundleService.getImageUrl(bundle.image)} 
                          alt={bundle.name} 
                          className="w-10 h-10 rounded object-cover" 
                          onError={(e) => {
                            console.log('Bundle image error:', bundle.image, 'Full URL:', bundleService.getImageUrl(bundle.image));
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}>
                          -
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-200 font-medium">{bundle.name}</td>
                    <td className="px-6 py-4 text-white font-semibold">Rp {bundle.bundlePrice.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${bundle.stock < 5 ? 'bg-red-900' : 'bg-green-900'}`}>
                        {bundle.stock} pcs
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      <div>
                        <span className="font-semibold">{bundle.products.length}</span> produk,{' '}
                        <span className="font-semibold">{bundle.services.length}</span> service
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bundle.isActive ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'}`}>
                        {bundle.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenModal(bundle)}
                        className="px-3 py-1 rounded text-sm font-medium transition-all mr-2"
                        style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(bundle);
                          setDeleteOpen(true);
                        }}
                        className="px-3 py-1 rounded text-sm font-medium transition-all bg-red-600 text-white hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && <p className="text-center py-8" style={{ color: '#999999' }}>Tidak ada data bundle</p>
      )}

      {/* CREATE/EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBundle ? 'Edit Bundle' : 'Tambah Bundle Baru'}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* BUNDLE NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nama Bundle</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              className="w-full px-3 py-2 rounded-lg border"
              style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}}
              placeholder="Contoh: Paket Haircut + Hair Powder"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              className="w-full px-3 py-2 rounded-lg border"
              style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}}
              placeholder="Deskripsi bundle..."
              rows="3"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Foto Bundle</label>
            {photoPreview && (
              <img 
                src={bundleService.getImageUrl(photoPreview)} 
                alt="Preview" 
                className="w-20 h-20 rounded-lg mb-2 object-cover" 
                onError={(e) => {
                  console.log('Bundle preview error:', photoPreview, 'Full URL:', bundleService.getImageUrl(photoPreview));
                  e.target.style.display = 'none';
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}}
            />
          </div>

          {/* BUNDLE PRICE & STOCK */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Harga Bundle</label>
              <input
                type="number"
                value={formData.bundlePrice}
                onChange={(e) => setFormData(prev => ({...prev, bundlePrice: parseInt(e.target.value) || 0}))}
                className="w-full px-3 py-2 rounded-lg border"
                style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Stok Bundle</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({...prev, stock: parseInt(e.target.value) || 0}))}
                className="w-full px-3 py-2 rounded-lg border"
                style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}}
                placeholder="0"
              />
            </div>
          </div>

          {/* ACTIVE TOGGLE */}
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', border: '1px solid' }}>
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.checked}))}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-300 cursor-pointer">Aktif</label>
          </div>

          <hr style={{ borderColor: '#333333' }} />

          {/* ADD PRODUCTS SECTION */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: '#D4AF37' }}>Tambah Produk</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm"
                  style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}}
                  disabled={productsLoading}
                >
                  <option value="">Pilih Produk...</option>
                  {availableProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={selectedProductQty}
                  onChange={(e) => setSelectedProductQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 px-3 py-2 rounded-lg border text-sm"
                  style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}}
                  min="1"
                />
                <button
                  onClick={addProductToBundle}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>

          {/* SELECTED PRODUCTS */}
          {formData.products.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2" style={{ color: '#D4AF37' }}>Produk Terpilih</h3>
              <div className="space-y-2">
                {formData.products.map(p => (
                  <div key={p.productId} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', border: '1px solid' }}>
                    <span className="text-sm text-gray-300">{p.productName} x {p.quantity}</span>
                    <button
                      onClick={() => removeProductFromBundle(p.productId)}
                      className="text-red-500 hover:text-red-400 text-sm font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr style={{ borderColor: '#333333' }} />

          {/* ADD SERVICES SECTION */}
          <div>
            <h3 className="font-semibold mb-2" style={{ color: '#D4AF37' }}>Tambah Service</h3>
            <div className="flex gap-2">
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border text-sm"
                style={{backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0'}}
                disabled={servicesLoading}
              >
                <option value="">Pilih Service...</option>
                {availableServices.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button
                onClick={addServiceToBundle}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
              >
                Tambah
              </button>
            </div>
          </div>

          {/* SELECTED SERVICES */}
          {formData.services.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2" style={{ color: '#D4AF37' }}>Service Terpilih</h3>
              <div className="space-y-2">
                {formData.services.map(s => (
                  <div key={s.serviceId} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', border: '1px solid' }}>
                    <span className="text-sm text-gray-300">{s.serviceName}</span>
                    <button
                      onClick={() => removeServiceFromBundle(s.serviceId)}
                      className="text-red-500 hover:text-red-400 text-sm font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL BUTTONS */}
        <div className="flex gap-2 mt-6 border-t pt-4" style={{ borderColor: '#333333' }}>
          <button
            onClick={handleCloseModal}
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-all"
            style={{ backgroundColor: '#2A2A2A', color: '#F0F0F0', border: '1px solid #333333' }}
          >
            Batal
          </button>
          <button
            onClick={handleSaveBundle}
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-all"
            style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
          >
            Simpan
          </button>
        </div>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Konfirmasi Hapus"
      >
        <p className="mb-6" style={{ color: '#D4D4D4' }}>Apakah Anda yakin ingin menghapus bundle <strong style={{ color: '#D4AF37' }}>{deleteTarget?.name}</strong>?</p>
        <div className="flex gap-2">
          <button
            onClick={() => setDeleteOpen(false)}
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-all"
            style={{ backgroundColor: '#2A2A2A', color: '#F0F0F0', border: '1px solid #333333' }}
          >
            Batal
          </button>
          <button
            onClick={handleDeleteBundle}
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-all bg-red-600 text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Bundle;
