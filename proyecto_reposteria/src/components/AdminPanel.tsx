import React, { useState, useEffect } from 'react';
import { ShoppingBag, Settings, Plus, Edit, Trash2, Home, LogOut, Upload, X, Tag } from 'lucide-react';
import { productsAPI, categoriesAPI, } from '../services/api';
import type { Database } from '../lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];



interface AdminPanelProps {
  onLogout: () => void;
  onBackToSite: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, onBackToSite }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para productos
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Estados para categorías
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

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
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos. Verifica la conexión con Supabase.');
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar imágenes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      setUploadingImage(true);
      
      // Validar tamaño del archivo (máximo 5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        throw new Error('El archivo es demasiado grande. Máximo 5MB.');
      }
      
      // Validar tipo de archivo
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('Solo se permiten archivos de imagen.');
      }
      
      const imageUrl = await productsAPI.uploadImage(imageFile);
      return imageUrl;
    } catch (error: any) {
      console.error('Error subiendo imagen:', error);
      alert(`Error al subir la imagen: ${error.message || 'Error desconocido'}`);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Funciones para manejar productos
  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}"?`)) {
      try {
        setLoading(true);
        await productsAPI.delete(productId);
        const updatedProducts = await productsAPI.getAll();
        setProducts(updatedProducts);
        alert('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category_id.toString(),
      image_url: product.image_url || ''
    });
    setImagePreview(product.image_url || '');
    setImageFile(null);
  };

  const handleCreateProduct = () => {
    setShowCreateModal(true);
    setEditForm({ name: '', description: '', price: '', category_id: '', image_url: '' });
    setImagePreview('');
    setImageFile(null);
  };

  const handleSaveProduct = async () => {
    try {
      setLoading(true);
      
      let imageUrl = editForm.image_url;
      
      // Si hay una nueva imagen, subirla
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      const productData = {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        category_id: parseInt(editForm.category_id),
        image_url: imageUrl
      };
      
      if (editingProduct) {
        // Actualizar producto existente
        await productsAPI.update(editingProduct.id, productData);
        alert('Producto actualizado exitosamente');
      } else {
        // Crear nuevo producto
        await productsAPI.create(productData);
        alert('Producto creado exitosamente');
        setShowCreateModal(false);
      }
      
      const updatedProducts = await productsAPI.getAll();
      setProducts(updatedProducts);
      handleCancelEdit();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setShowCreateModal(false);
    setEditForm({ name: '', description: '', price: '', category_id: '', image_url: '' });
    setImageFile(null);
    setImagePreview('');
  };

  // Funciones para manejar categorías
  const handleCreateCategory = () => {
    setShowCategoryModal(true);
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '' });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || ''
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    try {
      setLoading(true);
      
      const categoryData = {
        name: categoryForm.name,
        description: categoryForm.description
      };
      
      if (editingCategory) {
        // Actualizar categoría existente
        await categoriesAPI.update(editingCategory.id, categoryData);
        alert('Categoría actualizada exitosamente');
      } else {
        // Crear nueva categoría
        await categoriesAPI.create(categoryData);
        alert('Categoría creada exitosamente');
        setShowCategoryModal(false);
      }
      
      const updatedCategories = await categoriesAPI.getAll();
      setCategories(updatedCategories);
      handleCancelCategoryEdit();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
    // Verificar si hay productos que usan esta categoría
    const productsWithCategory = products.filter(product => product.category_id === categoryId);
    
    if (productsWithCategory.length > 0) {
      alert(`No se puede eliminar la categoría "${categoryName}" porque está siendo utilizada por ${productsWithCategory.length} producto(s). Primero debes cambiar la categoría de estos productos.`);
      return;
    }
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`)) {
      try {
        setLoading(true);
        await categoriesAPI.delete(categoryId);
        const updatedCategories = await categoriesAPI.getAll();
        setCategories(updatedCategories);
        alert('Categoría eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        alert('Error al eliminar la categoría. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setShowCategoryModal(false);
    setCategoryForm({ name: '', description: '' });
  };

  const handleBackToSiteClick = () => {
    if (typeof onBackToSite === 'function') {
      onBackToSite();
    } else {
      console.error('onBackToSite no es una función válida:', onBackToSite);
      alert('Error: La función onBackToSite no está disponible');
    }
  };

  const menuItems = [
    { id: 'products', label: 'Productos', icon: ShoppingBag },
    { id: 'categories', label: 'Categorías', icon: Tag },
    { id: 'settings', label: 'Configuraciones', icon: Settings },
  ];

  const renderProductModal = () => {
    const isEditing = !!editingProduct;
    const title = isEditing ? 'Editar Producto' : 'Crear Nuevo Producto';
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Nombre del producto"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows={3}
                placeholder="Descripción del producto"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={editForm.category_id}
                  onChange={(e) => setEditForm({...editForm, category_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Producto</label>
              
              {/* Vista previa de imagen */}
              {imagePreview && (
                <div className="mb-3">
                  <img 
                    src={imagePreview} 
                    alt="Vista previa" 
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
              
              {/* Input de archivo */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer border border-gray-300">
                  <Upload size={16} />
                  <span className="text-sm">Seleccionar imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                
                {imageFile && (
                  <span className="text-sm text-green-600">✓ {imageFile.name}</span>
                )}
              </div>
              
              {/* URL manual (opcional) */}
              <div className="mt-2">
                <input
                  type="url"
                  value={editForm.image_url}
                  onChange={(e) => {
                    setEditForm({...editForm, image_url: e.target.value});
                    if (e.target.value && !imageFile) {
                      setImagePreview(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  placeholder="O ingresa una URL de imagen"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading || uploadingImage}
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveProduct}
              disabled={loading || uploadingImage || !editForm.name || !editForm.price || !editForm.category_id}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {(loading || uploadingImage) && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isEditing ? 'Actualizar' : 'Crear'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryModal = () => {
    const isEditing = !!editingCategory;
    const title = isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría';
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={handleCancelCategoryEdit} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Nombre de la categoría"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
              <textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows={3}
                placeholder="Descripción de la categoría"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCancelCategoryEdit}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveCategory}
              disabled={loading || !categoryForm.name}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{isEditing ? 'Actualizar' : 'Crear'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
              <button 
                onClick={handleCreateProduct}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Nuevo Producto</span>
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Lista de Productos</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.image_url && (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover mr-4 border border-gray-200"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {categories.find(cat => cat.id === product.category_id)?.name || 'Sin categoría'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            onClick={() => handleEditProduct(product)}
                            title="Editar producto"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            title="Eliminar producto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {products.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay productos disponibles. Crea un nuevo producto.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'categories':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h2>
              <button 
                onClick={handleCreateCategory}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Nueva Categoría</span>
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Lista de Categorías</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Productos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => {
                      const productsCount = products.filter(p => p.category_id === category.id).length;
                      return (
                        <tr key={category.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 max-w-xs truncate">{category.description || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {productsCount} producto{productsCount !== 1 ? 's' : ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                              onClick={() => handleEditCategory(category)}
                              title="Editar categoría"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteCategory(category.id, category.name)}
                              title="Eliminar categoría"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {categories.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay categorías disponibles. Crea una nueva categoría.</p>
                  </div>
                )}
              </div>
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
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToSiteClick}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-md"
                type="button"
              >
                <Home size={20} />
                <span>Volver al Sitio</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-pink-100 text-pink-700 border border-pink-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <main className="flex-1 p-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>

      {/* Modal para crear/editar productos */}
      {(editingProduct || showCreateModal) && renderProductModal()}
      
      {/* Modal para crear/editar categorías */}
      {showCategoryModal && renderCategoryModal()}
    </div>
  );
};

export default AdminPanel;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(price);
};