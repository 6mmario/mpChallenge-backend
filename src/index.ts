import 'dotenv/config';   // carga automáticamente las variables de .env
import express, { Application } from 'express';
import morgan from 'morgan';
import router from './routes/index';
import cors from 'cors';
import { getSqlPool } from './services/db'; // Importa tu service para conectar a SQL Server
import casos from './routes/casos';
import fiscalesRouter from './routes/fiscales';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Morgan en modo 'dev' imprime: [MÉTODO] [RUTA] [ESTADO] - [TIEMPO]
app.use(morgan('dev'));
app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  console.log('Entró a GET /');
  res.send('¡Hola desde / !');
});


app.use('/usuario', router);
app.use('/casos', casos);
app.use('/fiscales', fiscalesRouter);

// Ruta para login de fiscal

/**
 * startServer(): 
 *   1) Intenta conectar a la base de datos usando getSqlPool()
 *   2) Si la conexión es exitosa, arranca el servidor (app.listen)
 *   3) Si hay error al conectar, muestra el error y termina el proceso
 */
const startServer = async () => {
  try {
    // Esta llamada crea (o reutiliza) el pool de conexión a SQL Server.
    // Si falla, captura el error en el catch y no levanta el servidor.
    await getSqlPool();
    console.log('✅ Conexión a SQL Server exitosa.');

    // Una vez que la BD está conectada, arrancamos Express:
    app.listen(PORT, () => {
      console.log(`🚀 Server corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectarse a SQL Server:', error);
    process.exit(1); // Sale del proceso con código 1 para indicar fallo
  }
};

// Llamamos a la función que levanta todo
startServer();