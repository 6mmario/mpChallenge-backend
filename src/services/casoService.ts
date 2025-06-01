// src/services/casoService.ts
import { spCrearCasoPorCorreo, spObtenerCasosPorCorreo } from './db';


export const crearCasoPorCorreo = async (
  correoElectronico: string,
  descripcion: string
): Promise<number> => {
  const nuevoID = await spCrearCasoPorCorreo(correoElectronico, descripcion);
  return nuevoID;
};

/**
 * Obtiene todos los casos para el correo electrónico dado usando el procedimiento almacenado.
 * Retorna un array de objetos Caso.
 */
export const listarCasos = async (correoElectronico: string): Promise<Caso[]> => {
  const casos = await spObtenerCasosPorCorreo(correoElectronico);
  return casos as Caso[];
};