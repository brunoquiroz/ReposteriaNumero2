import { useState} from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGallery from './components/ProductGallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { SiteSettings } from './services/api';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [settings] = useState<SiteSettings>({ show_hero: 'true' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);





  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    setIsAdmin(false);
    setShowAdminPanel(false);
    localStorage.removeItem('adminToken');
  };

  const handleBackToSite = () => {
    console.log('handleBackToSite llamado en App.tsx');
    console.log('Estado actual - showAdminPanel:', showAdminPanel);
    setShowAdminPanel(false);
    console.log('showAdminPanel establecido a false');

  };

  console.log('App render - showAdminLogin:', showAdminLogin, 'showAdminPanel:', showAdminPanel, 'isAdmin:', isAdmin);

  if (showAdminLogin) {
    return <AdminLogin 
      onLogin={handleAdminLogin} 
      onClose={() => setShowAdminLogin(false)}
    />;
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