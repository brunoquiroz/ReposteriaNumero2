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
import { API_BASE_URL } from '../config/constants';

interface AdminPanelProps {
  onLogout: () => void;
  onBackToSite: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, onBackToSite }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ show_hero: 'true' });
  const [loading, setLoading] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    console.log('AdminPanel montado, props recibidas:', { onLogout: !!onLogout, onBackToSite: !!onBackToSite });
    loadData();
    loadSettings();
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
    }
  };

  const handleSettingChange = async (key: string, value: string) => {
    try {
      await settingsAPI.update(key, value);
      setSettings({ ...settings, [key]: value });
      alert('Configuración actualizada exitosamente');
      
      // Recargar la página principal para reflejar los cambios
      if (key === 'show_hero') {
        window.dispatchEvent(new CustomEvent('settingsUpdated'));
      }
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      alert('Error al actualizar la configuración');
    }
  };

  const handleBackToSiteClick = () => {
    console.log('🔄 Botón "Volver al Sitio" clickeado');
    console.log('🔍 Verificando función onBackToSite:', typeof onBackToSite);
    
    if (typeof onBackToSite === 'function') {
      console.log('✅ Llamando a onBackToSite...');
      onBackToSite();
      console.log('✅ onBackToSite ejecutado');
    } else {
      console.error('❌ onBackToSite no es una función válida:', onBackToSite);
      alert('Error: La función onBackToSite no está disponible');
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
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
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
                                src={`${API_BASE_URL}${product.image_url}`} 
                                alt={product.name}
                                className="h-10 w-10 rounded-full object-cover mr-4"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {categories.find(cat => cat.id === product.category_id)?.name || 'Sin categoría'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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
        {/* Sidebar */}
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

        {/* Main Content */}
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
    </div>
  );
};

export default AdminPanel;