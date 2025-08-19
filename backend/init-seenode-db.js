const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la base de datos SeeNode
const dbConfig = {
  host: 'up-de-fra1-mysql-1.db.run-on-seenode.com',
  port: 11550,
  user: 'db_n3nv4jxto8ds',
  password: 'EQRBFExDGFKZSoMQNaIjTLpq',
  database: 'db_n3nv4jxto8ds'
};

const initSQL = `
-- Crear las tablas
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id INT NOT NULL,
    status ENUM('Disponible', 'Agotado') DEFAULT 'Disponible',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Usuario admin (contraseña: admin123)
INSERT IGNORE INTO admin_users (username, email, password_hash) VALUES 
('admin', 'admin@reposteria.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Configuraciones iniciales
INSERT IGNORE INTO site_settings (setting_key, setting_value, description) VALUES 
('hero_visible', 'true', 'Controla la visibilidad de la sección Hero'),
('site_title', 'Repostería Artesanal', 'Título del sitio web'),
('contact_email', 'contacto@reposteria.com', 'Email de contacto');

-- Categorías de ejemplo
INSERT IGNORE INTO categories (name, description) VALUES 
('Tortas', 'Tortas artesanales para toda ocasión'),
('Cupcakes', 'Cupcakes decorados y personalizados'),
('Galletas', 'Galletas caseras y decoradas'),
('Postres', 'Postres variados y deliciosos');

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_settings_key ON site_settings(setting_key);
`;

async function initDatabase() {
  let connection;
  
  try {
    console.log('🔍 Conectando a la base de datos SeeNode...');
    console.log('🔗 Host:', dbConfig.host);
    console.log('📊 Base de datos:', dbConfig.database);
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conectado exitosamente a SeeNode MySQL');
    
    // Ejecutar el script SQL
    console.log('🚀 Ejecutando script de inicialización...');
    const statements = initSQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    console.log('✅ Base de datos inicializada correctamente');
    
    // Verificar que las tablas se crearon
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tablas creadas:', tables.map(t => Object.values(t)[0]));
    
    // Verificar usuario admin
    const [users] = await connection.execute('SELECT username FROM admin_users');
    console.log('👤 Usuarios admin:', users.map(u => u.username));
    
    console.log('\n🎉 ¡Inicialización completada!');
    console.log('🔑 Credenciales de admin:');
    console.log('   Usuario: admin');
    console.log('   Contraseña: admin123');
    
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error.message);
    if (error.code) {
      console.error('🔍 Código de error:', error.code);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

initDatabase();