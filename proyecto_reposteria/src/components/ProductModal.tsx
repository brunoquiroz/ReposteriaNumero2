import { X, Instagram, MessageCircle, Facebook } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  ingredients: string;
  image: string;
  price: number;
  originalPrice?: number;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  // Función para formatear precios en formato chileno
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
        >
          <X className="h-6 w-6 text-amber-800" />
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 lg:h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder-product.jpg'
              }}
            />
          </div>
          
          <div className="p-8">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
              {product.category}
            </span>
            
            <h3 
              className="text-3xl font-bold text-amber-800 mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {product.name}
            </h3>
            
            <p className="text-lg text-amber-700 mb-6 leading-relaxed">
              {product.description}
            </p>
                        
            <div className="mb-6 p-4 bg-pink-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-pink-800 mb-1">
                    Precio:
                  </h4>
                  <div className="flex items-center">
                    <span 
                      className="text-3xl font-bold text-pink-600"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-3 text-xl text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                {product.originalPrice && (
                  <span className="px-3 py-2 bg-pink-200 text-pink-800 font-medium rounded-full">
                    ¡Oferta Especial!
                  </span>
                )}
              </div>
            </div>
            
            {/* Botones de Redes Sociales */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-amber-800 text-center">
                Contáctanos para hacer tu pedido personalizado
              </h4>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://www.instagram.com/dulcearte.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                  title="Síguenos en Instagram"
                >
                  <Instagram className="h-7 w-7" />
                </a>
                <a
                  href="https://wa.me/56912345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-14 h-14 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300 transform hover:scale-110 shadow-lg"
                  title="Escríbenos por WhatsApp"
                >
                  <MessageCircle className="h-7 w-7" />
                </a>
                <a
                  href="https://www.facebook.com/dulcearte.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 transform hover:scale-110 shadow-lg"
                  title="Síguenos en Facebook"
                >
                  <Facebook className="h-7 w-7" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}