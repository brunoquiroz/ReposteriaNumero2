const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('🔄 Intentando conectar a la base de datos...');
    
    const config = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true',
        connectTimeout: 10000
    };
    
    console.log('📋 Configuración:');
    console.log(`    Host: ${config.host}`);
    console.log(`    Usuario: ${config.user}`);
    console.log(`    Base de datos: ${config.database}`);
    console.log(`    SSL: ${config.ssl ? 'Habilitado' : 'Deshabilitado'}`);
    console.log('');
    console.log('==================================================');
    
    try {
        const connection = await mysql.createConnection(config);
        console.log('✅ ¡Conexión exitosa!');
        
        // Probar una consulta simple
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Consulta de prueba exitosa:', rows);
        
        // Listar tablas
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📊 Tablas en la base de datos:', tables.length);
        if (tables.length > 0) {
            console.log('📋 Lista de tablas:');
            tables.forEach(table => {
                console.log(`    - ${Object.values(table)[0]}`);
            });
        }
        
        await connection.end();
        console.log('✅ Conexión cerrada correctamente');
        
    } catch (error) {
        console.log('❌ Error de conexión:');
        console.log(`    Código: ${error.code}`);
        console.log(`    Mensaje: ${error.message}`);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n🔍 Sugerencias para ER_ACCESS_DENIED_ERROR:');
            console.log('   1. Verificar que la contraseña sea correcta');
            console.log('   2. Confirmar que el usuario tenga permisos');
            console.log('   3. Verificar que el usuario pueda conectarse desde esta IP');
            console.log('   4. Contactar al administrador de la base de datos');
        }
    }
}

testConnection();