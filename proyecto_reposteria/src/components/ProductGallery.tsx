import { useState, useEffect } from 'react'
import ProductModal from './ProductModal'
import { productsAPI, categoriesAPI, type Product, type Category } from '../services/api'

interface DisplayProduct {
  id: number
  name: string
  category: string
  description: string
  ingredients: string
  image: string
  price: string
  originalPrice?: string
}

export default function ProductGallery() {
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [selectedProduct, setSelectedProduct] = useState<DisplayProduct | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cargar productos y categorías desde Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')
        
        const [productsData, categoriesData] = await Promise.all([
          productsAPI.getPublic(),
          categoriesAPI.getPublic()
        ])
        
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error cargando datos:', error)
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        setError(`Error al cargar los datos: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Convertir productos de Supabase al formato de display
  const displayProducts: DisplayProduct[] = products.map(product => {
    const category = categories.find(cat => cat.id === product.category_id)
    return {
      id: product.id,
      name: product.name,
      category: category?.name || 'Sin categoría',
      description: product.description || 'Descripción no disponible',
      ingredients: 'Ingredientes premium seleccionados',
      image: product.image_url || '/placeholder-product.jpg',
      price: `$${product.price.toLocaleString()}`,
      originalPrice: undefined
    }
  })

  // Obtener categorías únicas
  const uniqueCategories = ['Todos', ...categories.map(cat => cat.name)]

  // Filtrar productos por categoría
  const filteredProducts = activeCategory === 'Todos' 
    ? displayProducts 
    : displayProducts.filter(product => product.category === activeCategory)

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Nuestros Productos
        </h2>
        
        {/* Filtros de categoría */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {uniqueCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-pink-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-product.jpg'
                  }}
                />
                <div className="absolute top-4 right-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-pink-600">
                    {product.price}
                  </span>
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No hay productos disponibles en esta categoría.
            </p>
          </div>
        )}
      </div>

      {/* Modal del producto */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  )
}