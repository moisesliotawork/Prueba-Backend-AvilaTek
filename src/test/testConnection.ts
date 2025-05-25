import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';

// Configuración de entorno
dotenv.config();

// Configuración de conexión
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

// Interfaz para los resultados de ping
interface PingResult {
  ok: number;
  [key: string]: any;
}

// Interfaz para la información de la base de datos
interface DatabaseInfo {
  name: string;
  sizeOnDisk?: number;
  empty?: boolean;
}

// Interfaz para la lista de bases de datos
interface ListDatabasesResult {
  databases: DatabaseInfo[];
  totalSize?: number;
  ok: number;
}

// Función principal de prueba de conexión
async function testMongoDBConnection(): Promise<void> {
  console.log('🚀 Iniciando prueba de conexión a MongoDB...\n');

  let connection: typeof mongoose;

  try {
    // 1. Establecer conexión
    console.log('1. Intentando conectar a MongoDB...');
    connection = await mongoose.connect(MONGODB_URI);

    console.log('   ✅ Conexión establecida correctamente');
    console.log(`   ℹ️  URI de conexión: ${MONGODB_URI.replace(/:[^:@]+@/, ':*****@')}`);

    // Verificar que la conexión y db están definidas
    if (!connection.connection || !connection.connection.db) {
      throw new Error('Conexión a la base de datos no establecida correctamente');
    }

    const db = connection.connection.db;
    const adminDb = db.admin();

    // 2. Verificar conexión con ping
    console.log('\n2. Realizando ping a la base de datos...');
    const pingResult = await adminDb.ping() as PingResult;
    
    if (pingResult.ok === 1) {
      console.log('   🟢 Ping exitoso:', pingResult);
    } else {
      throw new Error(`Ping fallido: ${JSON.stringify(pingResult)}`);
    }

    // 3. Obtener información del servidor
    console.log('\n3. Obteniendo información del servidor...');
    const serverStatus = await adminDb.serverStatus();
    console.log(`   🔍 Versión de MongoDB: ${serverStatus.version}`);
    console.log(`   🖥️  Host: ${serverStatus.host}`);
    console.log(`   ⏱️  Tiempo de actividad: ${Math.floor(serverStatus.uptime / 86400)} días`);

    // 4. Listar bases de datos
    console.log('\n4. Listando bases de datos disponibles...');
    const dbs = await adminDb.listDatabases() as ListDatabasesResult;
    console.log(`   📊 Total de bases de datos: ${dbs.databases.length}`);
    
    dbs.databases.forEach(db => {
      console.log(`   - ${db.name} ${db.sizeOnDisk ? `(${Math.round(db.sizeOnDisk / 1024)} KB)` : ''}`);
    });

    // 5. Verificar base de datos específica
    const targetDb = 'ecommerce';
    console.log(`\n5. Verificando base de datos '${targetDb}'...`);
    const dbExists = dbs.databases.some(db => db.name === targetDb);
    
    if (dbExists) {
      console.log(`   ✔️  La base de datos '${targetDb}' existe`);
      
      // 6. Listar colecciones en la base de datos objetivo
      console.log(`\n6. Listando colecciones en '${targetDb}'...`);
      const collections = await db.listCollections().toArray();
      
      if (collections.length > 0) {
        console.log(`   📂 Colecciones encontradas (${collections.length}):`);
        collections.forEach(collection => {
          console.log(`   - ${collection.name}`);
        });
      } else {
        console.log('   ℹ️  No se encontraron colecciones en esta base de datos');
      }
    } else {
      console.log(`   ⚠️  La base de datos '${targetDb}' no existe`);
    }

    console.log('\n🎉 ¡Prueba de conexión completada con éxito!');

  } catch (error: unknown) {
    console.error('\n❌ Error durante la prueba de conexión:');
    
    if (error instanceof Error) {
      console.error(`   Mensaje: ${error.message}`);
      
      // Detalles adicionales para errores específicos
      if (error.name === 'MongoServerSelectionError') {
        console.error('   Posibles causas:');
        console.error('   - MongoDB no está corriendo');
        console.error('   - La URI de conexión es incorrecta');
        console.error('   - Problemas de red/firewall');
      } else if (error.name === 'MongoNetworkError') {
        console.error('   Error de red al conectar con MongoDB');
      }
    } else {
      console.error('   Error desconocido:', error);
    }

    process.exit(1);

  } finally {
    // Cerrar la conexión
    console.log('\n🔌 Cerrando conexión...');
    await mongoose.disconnect();
    console.log('   ✅ Conexión cerrada correctamente');
    process.exit(0);
  }
}

// Ejecutar la prueba
testMongoDBConnection();