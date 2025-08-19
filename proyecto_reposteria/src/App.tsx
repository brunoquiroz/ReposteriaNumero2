import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGallery from './components/ProductGallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { settingsAPI, SiteSettings } from './services/api';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({ show_hero: 'true' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar si hay token de admin guardado
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdmin(true);
    }

    // Cargar configuraciones públicas
    loadSettings();

    // Escuchar cambios de configuración
    const handleSettingsUpdate = () => {
      loadSettings();
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await settingsAPI.getPublic();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setShowAdminPanel(true);
    }
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdmin(false);
    setShowAdminLogin(false);
    setShowAdminPanel(false);
  };

  const handleBackToSite = () => {
    console.log('handleBackToSite llamado en App.tsx');
    console.log('Estado actual - showAdminPanel:', showAdminPanel);
    setShowAdminPanel(false);
    console.log('showAdminPanel establecido a false');
    // Recargar configuraciones al volver al sitio
    loadSettings();
  };

  console.log('App render - showAdminLogin:', showAdminLogin, 'showAdminPanel:', showAdminPanel, 'isAdmin:', isAdmin);

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  if (showAdminPanel) {
    return <AdminPanel onLogout={handleLogout} onBackToSite={handleBackToSite} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onAdminClick={() => {
          if (isAdmin) {
            setShowAdminPanel(true);
          } else {
            setShowAdminLogin(true);
          }
        }} 
        isAdmin={isAdmin}
      />
      {settings.show_hero === 'true' && <Hero />}
      <ProductGallery />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;