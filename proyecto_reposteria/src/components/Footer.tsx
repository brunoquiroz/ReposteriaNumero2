import { Instagram, MessageCircle, MapPin, Phone, Mail, Facebook } from 'lucide-react';

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-amber-900 text-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 
              className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Dulce Arte
            </h3>
            <p className="text-amber-200 leading-relaxed mb-6 max-w-md">
              Creamos dulces momentos con repostería artesanal de la más alta calidad. 
              Cada producto es una obra de arte hecha con amor y dedicación.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/1JVrhqdBFe/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-blue-700 rounded-full hover:bg-blue-600 transition-colors duration-300"
                title="Síguenos en Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/yake.antinao?igsh=MTFvMTk0dG1iNjBtdg=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-amber-700 rounded-full hover:bg-amber-600 transition-colors duration-300"
                title="Síguenos en Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/56954228860"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-green-700 rounded-full hover:bg-green-600 transition-colors duration-300"
                title="Contáctanos por WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('inicio')}
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('productos')}
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  Productos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('sobre-nosotros')}
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="text-amber-200 hover:text-white transition-colors"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-amber-400" />
                <span className="text-amber-200">+56 9 5422 8860</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-amber-400" />
                <span className="text-amber-200">yakeantinao6@gmail.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-amber-400" />
                <span className="text-amber-200">
                  Puyehue kilometro 8 desde hualpin camino asia puerto dominguez, Teodoro Schmidt, Araucanía
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-amber-800 mt-12 pt-8 text-center">
          <p className="text-amber-300">
            © 2025 Tortas Caseras Puyehue. Todos los derechos reservados. 
            <span className="block sm:inline sm:ml-2">
              Hecho con ❤️ para endulzar tus momentos especiales.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}