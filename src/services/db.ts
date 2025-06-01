// src/services/db.ts
import sql, { ConnectionPool } from 'mssql';

const sqlConfig: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  server: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true,
  },
};

let pool: ConnectionPool | null = null;

export const getSqlPool = async (): Promise<ConnectionPool> => {
  if (pool) return pool;
  pool = await new sql.ConnectionPool(sqlConfig).connect();
  return pool;
};

/**
 * Este método invoca el SP usp_ObtenerFiscalPorCorreoYContrasena. 
 * Recibe:
 *   - correo: string
 *   - contrasenaHash: string  (el hash que envía el cliente)
 * Devuelve un array de objetos con los campos que retorna el SELECT del SP.
 */
export const obtenerFiscalPorCorreoYContrasena = async (
  correo: string,
  contrasenaHash: string
): Promise<any[]> => {
  const pool = await getSqlPool();
  const request = pool.request();

  // Par�metros que espera el SP según tu definición:
  request.input('CorreoElectronico', sql.NVarChar(100), correo);
  request.input('Contrasena', sql.NVarChar(255), contrasenaHash);

  // Ejecutamos el SP
  const result = await request.execute('usp_ObtenerFiscalPorCorreoYContrasena');
  // console.table(result.recordset)
  // recordset es el listado de filas devueltas
  return result.recordset;
};

/**
 * Llama al procedimiento almacenado dbo.usp_CrearCasoPorCorreo.
 * Recibe:
 *   - correoElectronico: string
 *   - descripcion: string
 * Devuelve el nuevo CasoID generado (INT).
 */
export const spCrearCasoPorCorreo = async (
  correoElectronico: string,
  descripcion: string
): Promise<number> => {
  const pool: ConnectionPool = await getSqlPool();
  const request = pool.request();

  request.input('CorreoElectronico', sql.NVarChar(100), correoElectronico);
  request.input('Descripcion', sql.NVarChar(sql.MAX), descripcion);
  request.output('NuevoCasoID', sql.Int);

  const result = await request.execute('dbo.usp_CrearCasoPorCorreo');

  const nuevoID = result.output.NuevoCasoID as number;
  if (!nuevoID) {
    throw new Error('No se pudo obtener el ID del nuevo caso.');
  }

  return nuevoID;
};

/**
 * Llama al procedimiento almacenado dbo.usp_ObtenerCasosPorCorreo.
 * Recibe:
 *   - correoElectronico: string
 * Devuelve un array de objetos con los campos CasoID, FechaRegistro, Estado, Progreso, Descripcion, FechaUltimaActualizacion y FiscalID.
 */
export const spObtenerCasosPorCorreo = async (
  correoElectronico: string
): Promise<any[]> => {
  const pool: ConnectionPool = await getSqlPool();
  const request = pool.request();

  request.input('CorreoElectronico', sql.NVarChar(100), correoElectronico);

  const result = await request.execute('dbo.usp_ObtenerCasosPorCorreo');

  return result.recordset;
};