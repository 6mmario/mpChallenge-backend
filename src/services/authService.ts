// src/services/authService.ts
import { obtenerFiscalPorCorreoYContrasena } from './db';

/**
 * Autentica al fiscal usando correo y hash de contraseña.
 * 1) Llama a obtenerFiscalPorCorreoYContrasena(correo, contrasenaHash)
 * 2) Si no hay filas, arroja error de credenciales.
 * 3) Si hay fila, retorna esa primera fila (sin exponer la contraseña).
 */
export const loginFiscal = async (
  correo: string,
  contrasenaHash: string
): Promise<Fiscal> => {
  const filas = await obtenerFiscalPorCorreoYContrasena(correo, contrasenaHash);

  if (!filas || filas.length === 0) {
    throw new Error('Usuario o contraseña incorrecta');
  }

  // El SP selecciona: FiscalID, Nombre, CorreoElectronico, Usuario, Rol, FiscaliaID
  // Podemos tiparlo manualmente o hacer un cast:
  const fiscalDb = filas[0] as Fiscal;

  // Devolvemos los campos públicos (no incluimos ningún campo "Contrasena" porque el SP no lo retornó)
  return fiscalDb;
};