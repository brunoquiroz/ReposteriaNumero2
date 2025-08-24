import { useState, useEffect } from 'react';
import ProductModal from './ProductModal';
import { Product } from '../services/api';
import { API_URL, API_BASE_URL } from '../config/constants';

interface DisplayProduct {
  id: number;
  name: string;
  category: string;
  description: string;
  ingredients: string;
  image: string;
  price: string;
  originalPrice?: string;
}

export default function ProductGallery() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState<DisplayProduct | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar productos y categorías desde la API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Cargar productos públicos (sin autenticación)
        const response = await fetch(`${API_URL}/public/products`);
        if (!response.ok) {
          throw new Error('Error al cargar productos');
        }
        const productsData = await response.json();
        setProducts(productsData);
        
        // Cargar categorías públicas
        const categoriesResponse = await fetch(`${API_URL}/public/categories`);
        if (categoriesResponse.ok) {
          await categoriesResponse.json();
        }
      } catch (error) {
        console.error('Error cargando productos:', error);
        setError('Error al cargar los productos. Por favor, intenta nuevamente.');
        
        // Fallback a datos estáticos si la API no está disponible
        setProducts([
          {
            id: 1,
            name: "Torta Red Velvet",
            price: 35000,
            category_id: 1,
            description: "Clásica torta red velvet con frosting de cream cheese",
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "Brownies Premium",
            price: 18000,
            category_id: 2,
            description: "Brownies fudge con nueces y chocolate belga",
            created_at: new Date().toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Convertir productos de la API al formato de display
  const displayProducts: DisplayProduct[] = products.map(product => ({
    id: product.id,
    name: product.name,
    category: 'Sin categoría', // Simplificado ya que no tenemos category_name en Product
    description: product.description || 'Descripción no disponible',
    ingredients: 'Ingredientes frescos y de calidad',
    image: product.image_url ? `${API_BASE_URL}${product.image_url}` : "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
    price: `$${Math.round(product.price).toLocaleString('es-CL')}`,
    originalPrice: undefined // Simplificado ya que no tenemos status en Product
  }));

  // Obtener categorías únicas para el filtro
  const availableCategories = ["Todos", ...Array.from(new Set(displayProducts.map(p => p.category)))];

  const filteredProducts = activeCategory === "Todos" 
    ? displayProducts 
    : displayProducts.filter(product => product.category === activeCategory);

  if (loading) {
    return (
      <section id="productos" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-amber-700">Cargando productos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="productos" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="productos" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl font-bold text-amber-800 mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Nuestras Creaciones Artesanales
          </h2>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto leading-relaxed">
            Cada dulce es una obra de arte, elaborado con ingredientes premium y técnicas tradicionales
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-amber-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-amber-700 hover:bg-amber-50 shadow-md hover:shadow-lg'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-amber-700 text-lg">No hay productos disponibles en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="inline-block px-3 py-1 bg-amber-600 rounded-full text-sm font-medium mb-2">
                        {product.category}
                      </span>
                      <p className="text-sm leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-lg font-bold text-amber-200">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-white/70 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 
                    className="text-2xl font-bold text-amber-800 mb-2"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-amber-600 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <span 
                        className="text-2xl font-bold text-amber-800"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-lg text-amber-500 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                        Oferta
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}