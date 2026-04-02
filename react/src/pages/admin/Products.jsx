import { useState, useEffect } from 'react';
import productService from '../../services/productService';
import Modal from '../../components/shared/Modal';

const Products = () => {
  // ========== PRODUCTS STATE ==========
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
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
    isActive: true
  });

  const productCategories = ['Hair Care', 'Beard Care', 'Styling'];

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

  const getFilteredProducts = () => {
    return products.filter(product => {
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      const matchesStatus = statusFilter === '' ||
        (statusFilter === 'active' && product.isActive) ||
        (statusFilter === 'inactive' && !product.isActive);
      return matchesCategory && matchesStatus;
    });
  };

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', stock: '', category: '', image: '', isActive: true });
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

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400 mt-1">Manage salon products</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex gap-3 flex-1">
          <input
            type="text"
            placeholder="Search products..."
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border transition-all"
            style={{
              backgroundColor: '#1A1A1A',
              borderColor: '#333333',
              color: '#F0F0F0'
            }}
          >
            <option value="">All Categories</option>
            {productCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
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
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          onClick={handleOpenCreateProduct}
          className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
          style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-8">Loading...</p>
      ) : getFilteredProducts().length > 0 ? (
        <div className="rounded-xl overflow-hidden shadow-2xl border" style={{ borderColor: '#333333' }}>
          <div className="overflow-x-auto" style={{ backgroundColor: '#1A1A1A' }}>
            <table className="w-full">
              <thead style={{ backgroundColor: '#0F0F0F' }}>
                <tr className="border-b" style={{ borderColor: '#333333' }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: '#D4AF37' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredProducts().map((product) => (
                  <tr key={product.id} className="border-b hover:opacity-75 transition-all" style={{ borderColor: '#333333' }}>
                    <td className="px-6 py-4">
                      {product.image ? (
                        <img src={productService.getImageUrl(product.image)} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}>
                          -
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-200 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{product.category}</td>
                    <td className="px-6 py-4 text-white font-semibold">{formatRupiah(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${product.stock < 5 ? 'bg-red-900' : 'bg-green-900'}`}>
                        {product.stock} pcs
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.isActive ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        className="px-3 py-1 rounded text-sm font-medium transition-all mr-2"
                        style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => { setDeleteTarget(product); setDeleteOpen(true); }}
                        className="px-3 py-1 rounded text-sm font-medium transition-all bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400 py-8">No products found</p>
      )}

      {/* Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmitProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 rounded-lg border"
              style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border"
              style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0' }}
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg border"
                style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border"
                style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border"
              style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0' }}
            >
              <option value="">Select Category</option>
              {productCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Product Image</label>
            {photoPreview && <img src={productService.getImageUrl(photoPreview)} alt="Preview" className="w-20 h-20 rounded-lg mb-2 object-cover" />}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-300">Active</span>
          </label>

          <div className="flex gap-2 pt-4 border-t" style={{ borderColor: '#333333' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 rounded-lg border transition-all"
              style={{ borderColor: '#333333', color: '#F0F0F0' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all"
              style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Confirm Delete"
      >
        <p className="text-gray-300 mb-6">Are you sure you want to delete product <strong>{deleteTarget?.name}</strong>?</p>
        <div className="flex gap-2">
          <button
            onClick={() => setDeleteOpen(false)}
            className="flex-1 px-4 py-2 rounded-lg border transition-all"
            style={{ borderColor: '#333333', color: '#F0F0F0' }}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteProduct}
            className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Products;