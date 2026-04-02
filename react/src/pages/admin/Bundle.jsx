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
        isActive: bundle.isActive
      });
    } else {
      setEditingBundle(null);
      setFormData({
        name: '',
        description: '',
        products: [],
        services: [],
        bundlePrice: '',
        stock: '',
        isActive: true
      });
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
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Bundle Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          + Tambah Bundle
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Cari bundle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
      </div>

      {/* LOADING */}
      {loading && <p className="text-center text-gray-500">Memuat...</p>}

      {/* BUNDLES TABLE */}
      {!loading && bundles.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Nama Bundle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Harga</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Stok</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Produk/Service</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map(bundle => (
                <tr key={bundle.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{bundle.name}</td>
                  <td className="px-6 py-4 text-gray-600">Rp {bundle.bundlePrice.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-gray-600">{bundle.stock}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="text-sm">
                      <span className="font-semibold">{bundle.products.length}</span> produk,{' '}
                      <span className="font-semibold">{bundle.services.length}</span> service
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${bundle.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {bundle.isActive ? 'Aktif' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleOpenModal(bundle)}
                      className="text-blue-600 hover:text-blue-800 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteTarget(bundle);
                        setDeleteOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-center text-gray-500">Tidak ada data bundle</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bundle</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Contoh: Paket Haircut + Hair Powder"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Deskripsi bundle..."
              rows="3"
            />
          </div>

          {/* BUNDLE PRICE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Bundle</label>
              <input
                type="number"
                value={formData.bundlePrice}
                onChange={(e) => setFormData(prev => ({...prev, bundlePrice: parseInt(e.target.value) || 0}))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Bundle</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({...prev, stock: parseInt(e.target.value) || 0}))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0"
              />
            </div>
          </div>

          {/* ACTIVE TOGGLE */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.checked}))}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">Aktif</span>
            </label>
          </div>

          <hr />

          {/* ADD PRODUCTS SECTION */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Tambah Produk</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
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
                  className="w-20 px-3 py-2 border rounded-lg text-sm"
                  min="1"
                />
                <button
                  onClick={addProductToBundle}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>

          {/* SELECTED PRODUCTS */}
          {formData.products.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Produk Terpilih</h3>
              <div className="space-y-2">
                {formData.products.map(p => (
                  <div key={p.productId} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm">{p.productName} x {p.quantity}</span>
                    <button
                      onClick={() => removeProductFromBundle(p.productId)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr />

          {/* ADD SERVICES SECTION */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Tambah Service</h3>
            <div className="flex gap-2">
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                disabled={servicesLoading}
              >
                <option value="">Pilih Service...</option>
                {availableServices.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button
                onClick={addServiceToBundle}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
              >
                Tambah
              </button>
            </div>
          </div>

          {/* SELECTED SERVICES */}
          {formData.services.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Terpilih</h3>
              <div className="space-y-2">
                {formData.services.map(s => (
                  <div key={s.serviceId} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm">{s.serviceName}</span>
                    <button
                      onClick={() => removeServiceFromBundle(s.serviceId)}
                      className="text-red-600 hover:text-red-800 text-sm"
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
        <div className="flex gap-2 mt-6 border-t pt-4">
          <button
            onClick={handleCloseModal}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={handleSaveBundle}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus bundle <strong>{deleteTarget?.name}</strong>?</p>
        <div className="flex gap-2">
          <button
            onClick={() => setDeleteOpen(false)}
            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            onClick={handleDeleteBundle}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Bundle;
