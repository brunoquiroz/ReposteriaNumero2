import React, { useState } from 'react';
import { Phone, Mail, MapPin, Instagram, MessageCircle, Facebook } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://formspree.io/f/mpwjzbaq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _replyto: formData.email
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl sm:text-5xl font-bold text-amber-800 mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Hablemos de tu Próximo
            <span className="text-amber-600"> Dulce Momento</span>
          </h2>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto leading-relaxed">
            Estamos listos para crear algo especial para ti. Cuéntanos tu idea y 
            haremos realidad el dulce de tus sueños.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-amber-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-amber-800 mb-6">
              Déjanos un Mensaje
            </h3>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                ¡Mensaje enviado exitosamente! Te contactaremos pronto.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-amber-700 font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-colors disabled:opacity-50"
                  placeholder="Tu nombre completo"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-amber-700 font-medium mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-colors disabled:opacity-50"
                  placeholder="tu@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-amber-700 font-medium mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-colors disabled:opacity-50"
                  placeholder="Cuéntanos qué dulce te gustaría encargar..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-amber-800 mb-6">
                Información de Contacto
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-amber-800">Teléfono</h4>
                    <p className="text-amber-600">+56 9 5422 8860</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-amber-800">Email</h4>
                    <p className="text-amber-600">yakeantinao6@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-amber-800">Ubicación</h4>
                    <p className="text-amber-600">Puyehue kilometro 8 desde hualpin camino asia puerto dominguez, Teodoro Schmidt, Araucanía</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-xl font-bold text-amber-800 mb-4">
                Síguenos en Redes Sociales
              </h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/yake.antinao/?igsh=MTFvMTk0dG1iNjBtdg%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110"
                  title="Síguenos en Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://wa.me/56954228860"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300 transform hover:scale-110"
                  title="Escríbenos por WhatsApp"
                >
                  <MessageCircle className="h-6 w-6" />
                </a>
                <a
                  href="https://www.facebook.com/tortas.casera.puyehue?rdid=2KTYQ60IOzRZaqLj&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1JVrhqdBFe%2F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 transform hover:scale-110"
                  title="Síguenos en Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}