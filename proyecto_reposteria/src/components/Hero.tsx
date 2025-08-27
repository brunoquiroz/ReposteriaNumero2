import { ChevronDown } from 'lucide-react';

export default function Hero() {
  
  

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Repostería Artesanal
          <br />
          <span className="text-amber-200">Puyehue</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-white/90 mb-8 font-light max-w-2xl mx-auto leading-relaxed">
          Exquisitas tortas, brownies y tartas hechas con amor y dedicación artesanal
        </p>
        
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white/60" />
      </div>
    </section>
  );
}