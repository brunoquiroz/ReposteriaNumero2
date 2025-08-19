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

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔍 Conectando a la base de datos SeeNode...');
    
    // Crear conexión
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Conectado exitosamente a SeeNode MySQL');
    
    // Crear tabla categories
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla categories creada');
    
    // Crear tabla products
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category_id INT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Tabla products creada');
    
    // Crear tabla admin_users
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla admin_users creada');
    
    // Crear tabla site_settings
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla site_settings creada');
    
    // Insertar datos iniciales
    // Categorías
    await connection.execute(`
      INSERT IGNORE INTO categories (name, description) VALUES 
      ('Tortas', 'Deliciosas tortas para toda ocasión'),
      ('Cupcakes', 'Cupcakes individuales perfectos para compartir'),
      ('Galletas', 'Galletas artesanales con ingredientes premium'),
      ('Postres', 'Variedad de postres tradicionales y modernos')
    `);
    console.log('✅ Categorías iniciales insertadas');
    
    // Usuario admin
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.execute(`
      INSERT IGNORE INTO admin_users (email, password, name) VALUES 
      ('admin@reposteria.com', ?, 'Administrador')
    `, [hashedPassword]);
    console.log('✅ Usuario admin creado');
    
    // Configuraciones del sitio
    await connection.execute(`
      INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES 
      ('show_hero', 'true'),
      ('hero_title', 'Bienvenido a Nuestra Repostería'),
      ('hero_subtitle', 'Los mejores postres artesanales de la ciudad')
    `);
    console.log('✅ Configuraciones del sitio insertadas');
    
    console.log('\n🎉 ¡Base de datos inicializada exitosamente!');
    console.log('📧 Email admin: admin@reposteria.com');
    console.log('🔑 Contraseña admin: admin123');
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar inicialización
initializeDatabase();