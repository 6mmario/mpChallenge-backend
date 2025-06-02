// src/services/fiscalService.ts
import { spListarFiscales } from './db';
/**
 * Obtiene todos los fiscales llamando al SP usp_ListarFiscales
 * y mapea cada fila al tipo Fiscal.
 */
export const listarFiscales = async (): Promise<Fiscal[]> => {
  const raw = await spListarFiscales();
  return raw.map((row: any) => ({
    FiscalID: row.FiscalID,
    Nombre: row.Nombre,
    CorreoElectronico: row.CorreoElectronico,
    Usuario: row.Usuario,
    Rol: row.Rol,
    FiscaliaID: row.FiscaliaID,
    // El SP no devuelve Permisos, así que lo dejamos vacío o null
    Permisos: '', 
  }));
};