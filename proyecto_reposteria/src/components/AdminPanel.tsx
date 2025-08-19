import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  LogOut, 
  Home,
  Plus,
  Edit,
  Trash2,
  Tag,
  Settings
} from 'lucide-react';
import { productsAPI, categoriesAPI, settingsAPI, Product, Category, SiteSettings } from '../services/api';

interface AdminPanelProps {
  onLogout: () => void;
  onBackToSite: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, onBackToSite }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({ show_hero: 'true' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category_id: 0,
    status: 'Disponible' as 'Disponible' | 'Agotado',
    description: '',
    image: null as File | null
  });
  const [editProduct, setEditProduct] = useState({
    name: '',
    price: 0,
    category_id: 0,
    status: 'Disponible' as 'Disponible' | 'Agotado',
    description: '',
    image: null as File | null,
    currentImageUrl: ''
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      
      // Cargar configuraciones si estamos en la pestaña de configuraciones
      if (activeTab === 'settings') {
        const settingsData = await settingsAPI.getAll();
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos. Verifica que el backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const settingsData = await settingsAPI.getAll();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
      alert('Error al cargar las configuraciones.');
    }
  };

  const handleSettingChange = async (key: string, value: string) => {
    try {
      await settingsAPI.update(key, value);
      setSettings({ ...settings, [key]: value });
      alert('Configuración actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      alert('Error al actualizar la configuración');
    }
  };

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.category_id) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price.toString());
        formData.append('category_id', newProduct.category_id.toString());
        formData.append('status', newProduct.status);
        formData.append('description', newProduct.description);
        
        if (newProduct.image) {
          formData.append('image', newProduct.image);
        }
        
        const createdProduct = await productsAPI.create(formData);
        setProducts([...products, createdProduct]);
        setNewProduct({ 
          name: '', 
          price: 0, 
          category_id: 0, 
          status: 'Disponible',
          description: '',
          image: null
        });
        setShowProductForm(false);
        alert('Producto agregado exitosamente');
      } catch (error) {
        console.error('Error creando producto:', error);
        alert('Error al crear el producto. Verifica los datos e intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Por favor completa todos los campos obligatorios');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        setLoading(true);
        await productsAPI.delete(id);
        setProducts(products.filter(p => p.id !== id));
        alert('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar el producto');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditProduct({
      name: product.name,
      price: product.price,
      category_id: product.category_id,
      status: product.status,
      description: product.description || '',
      image: null,
      currentImageUrl: product.image_url || ''
    });
    setShowEditForm(true);
  };

  const handleUpdateProduct = async () => {
    if (editProduct.name && editProduct.price && editProduct.category_id && editingProduct) {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', editProduct.name);
        formData.append('price', editProduct.price.toString());
        formData.append('category_id', editProduct.category_id.toString());
        formData.append('status', editProduct.status);
        formData.append('description', editProduct.description);
        
        if (editProduct.image) {
          formData.append('image', editProduct.image);
        }
        
        const updatedProduct = await productsAPI.update(editingProduct.id, formData);
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
        setEditingProduct(null);
        setEditProduct({
          name: '',
          price: 0,
          category_id: 0,
          status: 'Disponible',
          description: '',
          image: null,
          currentImageUrl: ''
        });
        setShowEditForm(false);
        alert('Producto actualizado exitosamente');
      } catch (error) {
        console.error('Error actualizando producto:', error);
        alert('Error al actualizar el producto. Verifica los datos e intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Por favor completa todos los campos obligatorios');
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowEditForm(false);
    setEditProduct({
      name: '',
      price: 0,
      category_id: 0,
      status: 'Disponible',
      description: '',
      image: null,
      currentImageUrl: ''
    });
  };

  const handleAddCategory = async () => {
    if (newCategory.name) {
      try {
        setLoading(true);
        const createdCategory = await categoriesAPI.create(newCategory);
        setCategories([...categories, createdCategory]);
        setNewCategory({ name: '', description: '' });
        setShowCategoryForm(false);
        alert('Categoría agregada exitosamente');
      } catch (error) {
        console.error('Error creando categoría:', error);
        alert('Error al crear la categoría. Verifica los datos e intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Por favor ingresa el nombre de la categoría');
    }
  };

  const menuItems = [
    { id: 'products', label: 'Productos', icon: ShoppingBag },
    { id: 'settings', label: 'Configuraciones', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowCategoryForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  disabled={loading}
                >
                  <Tag className="h-4 w-4" />
                  Nueva Categoría
                </button>
                <button 
                  onClick={() => setShowProductForm(true)}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center gap-2"
                  disabled={loading}
                >
                  <Plus className="h-4 w-4" />
                  Nuevo Producto
                </button>
              </div>
            </div>

            {/* Formulario para nueva categoría */}
            {showCategoryForm && (
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nueva Categoría</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Categoría *</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Tortas, Cupcakes, Galletas"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <input
                      type="text"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descripción de la categoría (opcional)"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddCategory}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Agregar Categoría'}
                  </button>
                  <button
                    onClick={() => setShowCategoryForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Formulario para editar producto */}
            {showEditForm && editingProduct && (
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Producto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto *</label>
                    <input
                      type="text"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Ej: Torta de Chocolate"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({...editProduct, price: parseFloat(e.target.value) || 0})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="25000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                    <select
                      value={editProduct.category_id}
                      onChange={(e) => setEditProduct({...editProduct, category_id: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    >
                      <option value={0}>Selecciona una categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select
                      value={editProduct.status}
                      onChange={(e) => setEditProduct({...editProduct, status: e.target.value as 'Disponible' | 'Agotado'})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Agotado">Agotado</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={editProduct.description}
                      onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Describe el producto (ingredientes, características, etc.)"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
                    {editProduct.currentImageUrl && !editProduct.image && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                        <img 
                          src={`http://localhost:3001${editProduct.currentImageUrl}`} 
                          alt="Imagen actual" 
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setEditProduct({...editProduct, image: file});
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    {editProduct.image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Nueva imagen:</p>
                        <img 
                          src={URL.createObjectURL(editProduct.image)} 
                          alt="Preview" 
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleUpdateProduct}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Actualizando...' : 'Actualizar Producto'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Formulario para nuevo producto */}
            {showProductForm && (
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Producto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto *</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Ej: Torta de Chocolate"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="25000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                    <select
                      value={newProduct.category_id}
                      onChange={(e) => setNewProduct({...newProduct, category_id: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    >
                      <option value={0}>Selecciona una categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select
                      value={newProduct.status}
                      onChange={(e) => setNewProduct({...newProduct, status: e.target.value as 'Disponible' | 'Agotado'})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Agotado">Agotado</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Describe el producto (ingredientes, características, etc.)"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setNewProduct({...newProduct, image: file});
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    {newProduct.image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                        <img 
                          src={URL.createObjectURL(newProduct.image)} 
                          alt="Preview" 
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleAddProduct}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Agregar Producto'}
                  </button>
                  <button
                    onClick={() => setShowProductForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Tabla de productos */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading && (
                <div className="p-4 text-center text-gray-500">
                  Cargando...
                </div>
              )}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const category = categories.find(c => c.id === product.category_id);
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.image_url && (
                              <img 
                                src={`http://localhost:3001${product.image_url}`} 
                                alt={product.name}
                                className="h-10 w-10 rounded-full object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              {product.description && (
                                <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {category?.name || 'Sin categoría'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${product.price.toLocaleString('es-CL')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.status === 'Disponible' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Configuraciones del Sitio</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Visibilidad de Secciones</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Sección Hero</h4>
                    <p className="text-sm text-gray-600">Controla si se muestra la sección principal de bienvenida</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.show_hero === 'true'}
                      onChange={(e) => handleSettingChange('show_hero', e.target.checked ? 'true' : 'false')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Selecciona una opción del menú</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Home className="h-8 w-8 text-pink-600" />
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow p-6 mr-8">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-pink-100 text-pink-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;