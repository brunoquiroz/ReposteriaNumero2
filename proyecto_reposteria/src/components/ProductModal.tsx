import { X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  ingredients: string;
  image: string;
  price: string;
  originalPrice?: string;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
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
                        
            <div className="mb-6 p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-amber-800 mb-1">
                    Precio:
                  </h4>
                  <div className="flex items-center">
                    <span 
                      className="text-3xl font-bold text-amber-800"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-3 text-xl text-amber-500 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                {product.originalPrice && (
                  <span className="px-3 py-2 bg-amber-200 text-amber-800 font-medium rounded-full">
                    ¡Oferta Especial!
                  </span>
                )}
              </div>
            </div>
            
            <div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}