import { useState, useEffect } from 'react';
import serviceService from '../../services/serviceService';
import productService from '../../services/productService';
import Modal from '../../components/shared/Modal';

const Services = () => {
    // ========== SERVICES STATE ==========
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [servicesSearch, setServicesSearch] = useState('');
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [deleteServiceOpen, setDeleteServiceOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [deleteServiceTarget, setDeleteServiceTarget] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const [products, setProducts] = useState([]); // For tracking available products

    const [serviceFormData, setServiceFormData] = useState({
        name: '',
        price: '',
        duration: '',
        category: '',
        image: '',
        requiredProducts: [],
        isActive: true
    });

    // ========== FETCH PRODUCTS (FOR DROPDOWNS) ==========
    useEffect(() => {
        const fetchAvailableProducts = async () => {
            try {
                const data = await productService.getAllProducts('');
                setProducts(data || []);
            } catch (err) {
                console.error('Failed to fetch products for service dependencies', err);
            }
        };
        fetchAvailableProducts();
    }, []);

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
        setServiceFormData({ name: '', price: '', duration: '', category: '', image: '', requiredProducts: [], isActive: true });
        setPhotoPreview(null);
        setIsServiceModalOpen(true);
    };

    const handleOpenEditService = (service) => {
        setEditingService(service);
        setServiceFormData({
            name: service.name,
            price: service.price,
            duration: service.duration,
            category: service.category || '',
            image: service.image || '',
            requiredProducts: service.requiredProducts || [],
            isActive: service.isActive
        });
        setPhotoPreview(service.image || null);
        setIsServiceModalOpen(true);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            console.log('[DEBUG] Uploading file:', file.name);
            const url = await serviceService.uploadFile(file);
            console.log('[DEBUG] Upload returned URL:', url);
            setServiceFormData(prev => ({ ...prev, image: url }));
            setPhotoPreview(url);
        } catch (err) {
            console.error('[DEBUG] Upload error:', err);
            alert('Gagal upload foto');
        }
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
            console.log('[DEBUG] Service payload being sent:', JSON.stringify(payload));
            console.log('[DEBUG] Image in payload:', payload.image);

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
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Services</h1>
                    <p className="text-gray-400 mt-1">Manage salon services</p>
                </div>
            </div>

            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search services..."
                    value={servicesSearch}
                    onChange={(e) => setServicesSearch(e.target.value)}
                    className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border transition-all"
                    style={{
                        backgroundColor: '#1A1A1A',
                        borderColor: '#333333',
                        color: '#F0F0F0'
                    }}
                />
                <button
                    onClick={handleOpenCreateService}
                    className="px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 hover:shadow-lg ml-4"
                    style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Service
                </button>
            </div>

            {/* Services Table */}
            {servicesLoading ? (
                <p className="text-center text-gray-400 py-8">Loading...</p>
            ) : services.length > 0 ? (
                <div className="rounded-xl overflow-hidden shadow-2xl border" style={{ borderColor: '#333333' }}>
                    <div className="overflow-x-auto" style={{ backgroundColor: '#1A1A1A' }}>
                        <table className="w-full">
                            <thead style={{ backgroundColor: '#0F0F0F' }}>
                                <tr className="border-b" style={{ borderColor: '#333333' }}>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Image</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Service Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Duration</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Products</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#D4AF37' }}>Status</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold" style={{ color: '#D4AF37' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service) => (
                                    <tr key={service.id} className="border-b hover:opacity-75 transition-all" style={{ borderColor: '#333333' }}>
                                        <td className="px-6 py-4">
                                            {service.image ? (
                                                <img src={serviceService.getImageUrl(service.image)} alt={service.name} className="w-10 h-10 rounded object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}>
                                                    -
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-200 font-medium">{service.name}</td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">{service.category}</td>
                                        <td className="px-6 py-4 text-white font-semibold">{formatRupiah(service.price)}</td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">{service.duration} min</td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">{service.requiredProducts?.length || 0} items</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${service.isActive ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'}`}>
                                                {service.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleOpenEditService(service)}
                                                className="px-3 py-1 rounded text-sm font-medium transition-all mr-2"
                                                style={{ backgroundColor: '#D4AF37', color: '#0F0F0F' }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => { setDeleteServiceTarget(service); setDeleteServiceOpen(true); }}
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
                <p className="text-center text-gray-400 py-8">No services found</p>
            )}

            {/* Service Modal */}
            <Modal
                isOpen={isServiceModalOpen}
                onClose={() => setIsServiceModalOpen(false)}
                title={editingService ? 'Edit Service' : 'Add New Service'}
            >
                <form onSubmit={handleSubmitService} className="space-y-4 max-h-96 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Service Name</label>
                        <input
                            type="text"
                            value={serviceFormData.name}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                            required
                            className="w-full px-3 py-2 rounded-lg border"
                            style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0' }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
                            <input
                                type="number"
                                value={serviceFormData.price}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                                required
                                className="w-full px-3 py-2 rounded-lg border"
                                style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0' }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Duration (min)</label>
                            <input
                                type="number"
                                value={serviceFormData.duration}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, duration: e.target.value })}
                                required
                                className="w-full px-3 py-2 rounded-lg border"
                                style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <select
                            value={serviceFormData.category}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border"
                            style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0' }}
                        >
                            <option value="">Select Category</option>
                            <option value="Haircut">Haircut</option>
                            <option value="Coloring">Coloring</option>
                            <option value="Beard">Beard</option>
                            <option value="Styling">Styling</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Service Image</label>
                        {photoPreview && <img src={serviceService.getImageUrl(photoPreview)} alt="Preview" className="w-20 h-20 rounded-lg mb-2 object-cover" />}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="w-full text-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Required Products</label>
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
                                            setServiceFormData({ ...serviceFormData, requiredProducts: updatedProducts });
                                        }}
                                        className="flex-1 px-3 py-2 rounded-lg border text-sm"
                                        style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0' }}
                                    >
                                        <option value="">Select Product</option>
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
                                            setServiceFormData({ ...serviceFormData, requiredProducts: updatedProducts });
                                        }}
                                        placeholder="Qty"
                                        className="w-16 px-3 py-2 rounded-lg border text-sm"
                                        style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#F0F0F0' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProductFromService(idx)}
                                        className="px-3 py-2 rounded-lg text-red-400 hover:bg-red-600/20 transition-all"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddProductToService}
                            className="mt-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                            style={{ backgroundColor: '#333333', color: '#D4AF37' }}
                        >
                            + Add Product
                        </button>
                    </div>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={serviceFormData.isActive}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, isActive: e.target.checked })}
                            className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-300">Active</span>
                    </label>

                    <div className="flex gap-2 pt-4 border-t" style={{ borderColor: '#333333' }}>
                        <button
                            type="button"
                            onClick={() => setIsServiceModalOpen(false)}
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

            {/* Delete Confirmation */}
            <Modal
                isOpen={deleteServiceOpen}
                onClose={() => setDeleteServiceOpen(false)}
                title="Confirm Delete"
            >
                <p className="text-gray-300 mb-6">Are you sure you want to delete service <strong>{deleteServiceTarget?.name}</strong>?</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setDeleteServiceOpen(false)}
                        className="flex-1 px-4 py-2 rounded-lg border transition-all"
                        style={{ borderColor: '#333333', color: '#F0F0F0' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteService}
                        className="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all"
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Services;
