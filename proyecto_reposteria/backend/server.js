const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 11550;

// Configuración de multer para carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
// Servir archivos estáticos desde uploads
app.use('/uploads', express.static('uploads'));

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || 'srv2021.hstgr.io',
  user: process.env.DB_USER || 'u896143123_root2',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'u896143123_reposteria2',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  // Removidas: connectTimeout, acquireTimeout, timeout (no válidas para conexiones)
};

// Crear conexión a la base de datos
let db;

async function initDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Conectado a MySQL');
    console.log('Configuración DB:', {
      host: dbConfig.host,
      database: dbConfig.database,
      user: dbConfig.user
    });
  } catch (error) {
    console.error('Error conectando a MySQL:', error);
    process.exit(1);
  }
}

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [rows] = await db.execute(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Rutas públicas (sin autenticación)
app.get('/api/public/categories', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo categorías públicas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.get('/api/public/products', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.status = 'Disponible'
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo productos públicos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Rutas de categorías (con autenticación)
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );

    const [newCategory] = await db.execute(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Rutas de productos (con autenticación)
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Modificar el endpoint POST /api/products
app.post('/api/products', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, price, category_id, status, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const [result] = await db.execute(
      'INSERT INTO products (name, price, category_id, status, description, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, category_id, status, description, image_url]
    );

    const [newProduct] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [result.insertId]);

    res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Modificar el endpoint PUT /api/products/:id
app.put('/api/products/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category_id, status, description } = req.body;
    
    let updateQuery = 'UPDATE products SET name = ?, price = ?, category_id = ?, status = ?, description = ?';
    let updateParams = [name, price, category_id, status, description];
    
    if (req.file) {
      // Si hay nueva imagen, eliminar la anterior
      const [currentProduct] = await db.execute('SELECT image_url FROM products WHERE id = ?', [id]);
      if (currentProduct[0]?.image_url) {
        const oldImagePath = path.join(__dirname, currentProduct[0].image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      updateQuery += ', image_url = ?';
      updateParams.push(`/uploads/${req.file.filename}`);
    }
    
    updateQuery += ' WHERE id = ?';
    updateParams.push(id);
    
    await db.execute(updateQuery, updateParams);

    const [updatedProduct] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [id]);

    res.json(updatedProduct[0]);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para estadísticas del dashboard
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const [productCount] = await db.execute('SELECT COUNT(*) as count FROM products');
    const [categoryCount] = await db.execute('SELECT COUNT(*) as count FROM categories');
    const [availableProducts] = await db.execute('SELECT COUNT(*) as count FROM products WHERE status = "Disponible"');
    
    res.json({
      totalProducts: productCount[0].count,
      totalCategories: categoryCount[0].count,
      availableProducts: availableProducts[0].count
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Rutas de configuraciones del sitio
app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM site_settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    console.error('Error obteniendo configuraciones:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.get('/api/public/settings', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM site_settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    console.error('Error obteniendo configuraciones públicas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.put('/api/settings/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    await db.execute(
      'UPDATE site_settings SET setting_value = ? WHERE setting_key = ?',
      [value, key]
    );

    res.json({ message: 'Configuración actualizada exitosamente' });
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Inicializar servidor
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});