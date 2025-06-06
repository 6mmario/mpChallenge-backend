// src/services/db.ts
import sql, { ConnectionPool } from "mssql";
import { Informe } from "../models/Informe";

const sqlConfig: sql.config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  server: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
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
  request.input("CorreoElectronico", sql.NVarChar(100), correo);
  request.input("Contrasena", sql.NVarChar(255), contrasenaHash);

  // Ejecutamos el SP
  const result = await request.execute("usp_ObtenerFiscalPorCorreoYContrasena");
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

  request.input("CorreoElectronico", sql.NVarChar(100), correoElectronico);
  request.input("Descripcion", sql.NVarChar(sql.MAX), descripcion);
  request.output("NuevoCasoID", sql.Int);

  const result = await request.execute("dbo.usp_CrearCasoPorCorreo");

  const nuevoID = result.output.NuevoCasoID as number;
  if (!nuevoID) {
    throw new Error("No se pudo obtener el ID del nuevo caso.");
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

  request.input("CorreoElectronico", sql.NVarChar(100), correoElectronico);

  const result = await request.execute("dbo.usp_ObtenerCasosPorCorreo");

  return result.recordset;
};

/**
 * Llama al procedimiento almacenado dbo.usp_AgregarInformeAlCaso.
 * Recibe:
 *   - correoElectronico: string
 *   - casoID: number
 *   - tipoInforme: string
 *   - descripcionBreve: string
 * Devuelve el nuevo InformeID generado (INT).
 */
export const spAgregarInformeAlCaso = async (
  informe: Informe
): Promise<number> => {
  const pool: ConnectionPool = await getSqlPool();
  const request = pool.request();

  request.input(
    "CorreoElectronico",
    sql.NVarChar(100),
    informe.correoElectronico
  );
  request.input("CasoID", sql.Int, informe.casoID);
  request.input("TipoInforme", sql.NVarChar(100), informe.TipoInforme);
  request.input(
    "DescripcionBreve",
    sql.NVarChar(255),
    informe.DescripcionBreve
  );
  request.input("Estado", sql.NVarChar(50), informe.Estado);
  request.input("Progreso", sql.NVarChar(50), informe.Progreso);
  request.output("NuevoInformeID", sql.Int);

  const result = await request.execute("dbo.usp_AgregarInformeAlCaso");

  const nuevoInformeID = result.output.NuevoInformeID as number;
  if (!nuevoInformeID) {
    throw new Error("No se pudo obtener el ID del nuevo informe.");
  }
  return nuevoInformeID;
};

/**
 * Llama al SP usp_ReasignarCaso y captura @MotivoSalida.
 * @param casoID         → ID del caso que se desea reasignar.
 * @param nuevoFiscalID  → ID del fiscal al que se quiere reasignar el caso.
 * @returns string | null → Si hay fallo, el texto de motivo; si éxitoso, null.
 */
export const spReasignarCaso = async (
  casoID: number,
  nuevoFiscalID: number
): Promise<string | null> => {
  const pool = await getSqlPool();
  const request = pool.request();

  request.input("CasoID", sql.Int, casoID);
  request.input("NuevoFiscalID", sql.Int, nuevoFiscalID);
  request.output("MotivoSalida", sql.NVarChar(255));

  const result = await request.execute("dbo.usp_ReasignarCaso");
  // @MotivoSalida vendrá en result.output.MotivoSalida
  const motivo = result.output.MotivoSalida as string | null;
  return motivo;
};

/**
 * Llama al stored procedure dbo.usp_ListarFiscales y devuelve el recordset.
 */
export const spListarFiscales = async (): Promise<any[]> => {
  const pool: ConnectionPool = await getSqlPool();
  const request = pool.request();

  const result = await request.execute("dbo.usp_ListarFiscales");
  return result.recordset;
};
