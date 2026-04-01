import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import serviceService from '../../services/serviceService';
import Modal from '../../components/shared/Modal';

const Products = () => {
  const [activeTab, setActiveTab] = useState('products');
  
  // ========== PRODUCTS STATE ==========
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    sku: '',
    image: '',
    isActive: true
  });

  // ========== SERVICES STATE ==========
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesSearch, setServicesSearch] = useState('');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [deleteServiceOpen, setDeleteServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteServiceTarget, setDeleteServiceTarget] = useState(null);

  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    price: '',
    duration: '',
    category: '',
    requiredProducts: [],
    isActive: true
  });

  // ========== PRODUCTS FUNCTIONS ==========

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(search);
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', stock: '', category: '', sku: '', image: '', isActive: true });
    setPhotoPreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      sku: product.sku || '',
      image: product.image || '',
      isActive: product.isActive
    });
    setPhotoPreview(product.image || null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await productService.uploadFile(file);
      setFormData({ ...formData, image: url });
      setPhotoPreview(url);
    } catch (err) {
      alert('Gagal upload foto');
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        isActive: formData.isActive
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        alert("Produk berhasil diupdate!");
      } else {
        await productService.createProduct(payload);
        alert("Produk berhasil dibuat!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || "Terjadi kesalahan");
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      await productService.deleteProduct(deleteTarget.id);
      alert("Produk berhasil dihapus");
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      alert("Gagal menghapus produk");
    }
  };

  // ========== SERVICES FUNCTIONS ==========

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const data = await serviceService.getAllServices(servicesSearch);
      setServices(data || []);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil data services');
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [servicesSearch]);

  const handleOpenCreateService = () => {
    setEditingService(null);
    setServiceFormData({ name: '', price: '', duration: '', category: '', requiredProducts: [], isActive: true });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceFormData({
      name: service.name,
      price: service.price,
      duration: service.duration,
      category: service.category || '',
      requiredProducts: service.requiredProducts || [],
      isActive: service.isActive
    });
    setIsServiceModalOpen(true);
  };

  const handleAddProductToService = () => {
    setServiceFormData({
      ...serviceFormData,
      requiredProducts: [...serviceFormData.requiredProducts, { productId: '', productName: '', quantity: 1 }]
    });
  };

  const handleRemoveProductFromService = (index) => {
    setServiceFormData({
      ...serviceFormData,
      requiredProducts: serviceFormData.requiredProducts.filter((_, i) => i !== index)
    });
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...serviceFormData,
        price: Number(serviceFormData.price),
        duration: Number(serviceFormData.duration),
        isActive: serviceFormData.isActive
      };

      if (editingService) {
        await serviceService.updateService(editingService.id, payload);
        alert("Service berhasil diupdate!");
      } else {
        await serviceService.createService(payload);
        alert("Service berhasil dibuat!");
      }
      setIsServiceModalOpen(false);
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.error || "Terjadi kesalahan");
    }
  };

  const handleDeleteService = async () => {
    if (!deleteServiceTarget) return;
    try {
      await serviceService.deleteService(deleteServiceTarget.id);
      alert("Service berhasil dihapus");
      setDeleteServiceOpen(false);
      setDeleteServiceTarget(null);
      fetchServices();
    } catch (err) {
      alert("Gagal menghapus service");
    }
  };

  // ========== HELPER ==========

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // ========== RENDER ==========

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Products & Services</h1>
        <p style={{ color: 'var(--color-muted)' }}>Kelola produk dan layanan salon</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-3 font-semibold transition-colors ${
            activeTab === 'products'
              ? 'border-b-2 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          style={activeTab === 'products' ? { borderBottomColor: 'var(--color-gold)', color: 'white' } : {}}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-3 font-semibold transition-colors ${
            activeTab === 'services'
              ? 'border-b-2 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          style={activeTab === 'services' ? { borderBottomColor: 'var(--color-gold)', color: 'white' } : {}}
        >
          Services
        </button>
      </div>

      {/* ========== PRODUCTS TAB ========== */}
      {activeTab === 'products' && (
        <div>
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border w-1/3 focus:outline-none"
              style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'white' }}
            />
            <button
              onClick={handleOpenCreateProduct}
              className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-gold)', color: 'black' }}
            >
              + Add Product
            </button>
          </div>

          {/* Products Table */}
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <table className="w-full text-left text-sm">
              <thead style={{ backgroundColor: 'var(--color-secondary)' }}>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Foto</th>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Nama</th>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Kategori</th>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Harga</th>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Stok</th>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Status</th>
                  <th className="p-4 text-center" style={{ color: 'var(--color-muted)' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="p-8 text-center" style={{ color: 'var(--color-muted)' }}>Loading...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan="7" className="p-8 text-center" style={{ color: 'var(--color-muted)' }}>Tidak ada produk</td></tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-opacity-50" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="p-4">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded flex items-center justify-center text-xs" style={{ backgroundColor: 'var(--color-gold)', color: 'black' }}>
                            -
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-white font-medium">{product.name}</td>
                      <td className="p-4" style={{ color: 'var(--color-muted)' }}>{product.category}</td>
                      <td className="p-4 text-white font-semibold">{formatRupiah(product.price)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${product.stock < 5 ? 'bg-red-600' : 'bg-green-600'} text-white`}>
                          {product.stock} pcs
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${product.isActive ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                          {product.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditProduct(product)}
                            className="p-2 rounded hover:bg-blue-600/20 text-white"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => { setDeleteTarget(product); setDeleteOpen(true); }}
                            className="p-2 rounded hover:bg-red-600/20 text-white"
                            title="Hapus"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Product Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingProduct ? "Edit Product" : "Tambah Product"}
          >
            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Nama Product</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full p-2 rounded border focus:outline-none"
                  style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 rounded border focus:outline-none"
                  style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Harga</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                    className="w-full p-2 rounded border focus:outline-none"
                    style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Stok</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full p-2 rounded border focus:outline-none"
                    style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 rounded border focus:outline-none"
                    style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Beard Care">Beard Care</option>
                    <option value="Styling">Styling</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full p-2 rounded border focus:outline-none"
                    style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Foto Product (Upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-2 rounded border focus:outline-none text-sm"
                  style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                />
                {photoPreview && (
                  <div className="mt-2 flex justify-center">
                    <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <span style={{ color: 'var(--color-muted)' }}>Aktif</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded border" style={{ borderColor: 'var(--color-border)', color: 'white' }}>
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2 rounded font-semibold" style={{ backgroundColor: 'var(--color-gold)', color: 'black' }}>
                  Simpan
                </button>
              </div>
            </form>
          </Modal>

          {/* Delete Confirmation */}
          <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Konfirmasi Hapus">
            <div className="text-center">
              <p className="mb-6" style={{ color: 'var(--color-muted)' }}>
                Yakin hapus produk <strong className="text-white">{deleteTarget?.name}</strong>?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteOpen(false)} className="flex-1 py-2 rounded border" style={{ borderColor: 'var(--color-border)', color: 'white' }}>
                  Batal
                </button>
                <button onClick={handleDeleteProduct} className="flex-1 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700">
                  Hapus
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* ========== SERVICES TAB ========== */}
      {activeTab === 'services' && (
        <div>
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Cari service..."
              value={servicesSearch}
              onChange={(e) => setServicesSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border w-1/3 focus:outline-none"
              style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', color: 'white' }}
            />
            <button
              onClick={handleOpenCreateService}
              className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-gold)', color: 'black' }}
            >
              + Add Service
            </button>
          </div>

          {/* Services Table */}
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <table className="w-full text-left text-sm">
              <thead style={{ backgroundColor: 'var(--color-secondary)' }}>
                <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Nama Service</th>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Kategori</th>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Harga</th>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Durasi</th>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Produk</th>
                  <th className="p-4" style={{ color: 'var(--color-muted)' }}>Status</th>
                  <th className="p-4 text-center" style={{ color: 'var(--color-muted)' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {servicesLoading ? (
                  <tr><td colSpan="7" className="p-8 text-center" style={{ color: 'var(--color-muted)' }}>Loading...</td></tr>
                ) : services.length === 0 ? (
                  <tr><td colSpan="7" className="p-8 text-center" style={{ color: 'var(--color-muted)' }}>Tidak ada service</td></tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.id} className="border-b hover:bg-opacity-50" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="p-4 text-white font-medium">{service.name}</td>
                      <td className="p-4" style={{ color: 'var(--color-muted)' }}>{service.category}</td>
                      <td className="p-4 text-white font-semibold">{formatRupiah(service.price)}</td>
                      <td className="p-4" style={{ color: 'var(--color-muted)' }}>{service.duration} min</td>
                      <td className="p-4">
                        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                          {service.requiredProducts?.length || 0} produk
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${service.isActive ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                          {service.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditService(service)}
                            className="p-2 rounded hover:bg-blue-600/20 text-white"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => { setDeleteServiceTarget(service); setDeleteServiceOpen(true); }}
                            className="p-2 rounded hover:bg-red-600/20 text-white"
                            title="Hapus"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Service Modal */}
          <Modal
            isOpen={isServiceModalOpen}
            onClose={() => setIsServiceModalOpen(false)}
            title={editingService ? "Edit Service" : "Tambah Service"}
          >
            <form onSubmit={handleSubmitService} className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Nama Service</label>
                <input
                  type="text"
                  value={serviceFormData.name}
                  onChange={(e) => setServiceFormData({...serviceFormData, name: e.target.value})}
                  required
                  className="w-full p-2 rounded border focus:outline-none"
                  style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Harga</label>
                  <input
                    type="number"
                    value={serviceFormData.price}
                    onChange={(e) => setServiceFormData({...serviceFormData, price: e.target.value})}
                    required
                    className="w-full p-2 rounded border focus:outline-none"
                    style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Durasi (menit)</label>
                  <input
                    type="number"
                    value={serviceFormData.duration}
                    onChange={(e) => setServiceFormData({...serviceFormData, duration: e.target.value})}
                    required
                    className="w-full p-2 rounded border focus:outline-none"
                    style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1" style={{ color: 'var(--color-muted)' }}>Kategori</label>
                <select
                  value={serviceFormData.category}
                  onChange={(e) => setServiceFormData({...serviceFormData, category: e.target.value})}
                  className="w-full p-2 rounded border focus:outline-none"
                  style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Haircut">Haircut</option>
                  <option value="Coloring">Coloring</option>
                  <option value="Beard">Beard</option>
                  <option value="Styling">Styling</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-2" style={{ color: 'var(--color-muted)' }}>
                  Produk yang Diperlukan
                </label>
                <div className="space-y-2">
                  {serviceFormData.requiredProducts.map((product, idx) => (
                    <div key={idx} className="flex gap-2">
                      <select
                        value={product.productId}
                        onChange={(e) => {
                          const selectedProduct = products.find(p => p.id === e.target.value);
                          const updatedProducts = [...serviceFormData.requiredProducts];
                          updatedProducts[idx].productId = e.target.value;
                          updatedProducts[idx].productName = selectedProduct?.name || '';
                          setServiceFormData({...serviceFormData, requiredProducts: updatedProducts});
                        }}
                        className="flex-1 p-2 rounded border text-sm focus:outline-none"
                        style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                      >
                        <option value="">Pilih Produk</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => {
                          const updatedProducts = [...serviceFormData.requiredProducts];
                          updatedProducts[idx].quantity = Number(e.target.value);
                          setServiceFormData({...serviceFormData, requiredProducts: updatedProducts});
                        }}
                        placeholder="Qty"
                        className="w-16 p-2 rounded border text-sm focus:outline-none"
                        style={{ backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-border)', color: 'white' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveProductFromService(idx)}
                        className="px-3 py-2 rounded text-red-500 hover:bg-red-600/20"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddProductToService}
                  className="mt-2 px-3 py-2 rounded text-sm font-semibold"
                  style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-gold)' }}
                >
                  + Tambah Produk
                </button>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={serviceFormData.isActive}
                    onChange={(e) => setServiceFormData({...serviceFormData, isActive: e.target.checked})}
                  />
                  <span style={{ color: 'var(--color-muted)' }}>Aktif</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 sticky bottom-0" style={{ backgroundColor: 'var(--color-card)' }}>
                <button type="button" onClick={() => setIsServiceModalOpen(false)} className="flex-1 py-2 rounded border" style={{ borderColor: 'var(--color-border)', color: 'white' }}>
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2 rounded font-semibold" style={{ backgroundColor: 'var(--color-gold)', color: 'black' }}>
                  Simpan
                </button>
              </div>
            </form>
          </Modal>

          {/* Delete Confirmation */}
          <Modal isOpen={deleteServiceOpen} onClose={() => setDeleteServiceOpen(false)} title="Konfirmasi Hapus">
            <div className="text-center">
              <p className="mb-6" style={{ color: 'var(--color-muted)' }}>
                Yakin hapus service <strong className="text-white">{deleteServiceTarget?.name}</strong>?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteServiceOpen(false)} className="flex-1 py-2 rounded border" style={{ borderColor: 'var(--color-border)', color: 'white' }}>
                  Batal
                </button>
                <button onClick={handleDeleteService} className="flex-1 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700">
                  Hapus
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Products;