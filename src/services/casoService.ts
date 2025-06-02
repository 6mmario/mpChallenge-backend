// src/services/casoService.ts
import { Informe } from "../models/Informe";
import {
  spAgregarInformeAlCaso,
  spCrearCasoPorCorreo,
  spObtenerCasosPorCorreo,
  spReasignarCaso,
} from "./db";

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
export const listarCasos = async (
  correoElectronico: string
): Promise<Caso[]> => {
  const casos = await spObtenerCasosPorCorreo(correoElectronico);
  return casos as Caso[];
};

/**
 * Agrega un informe al caso correspondiente, usando el SP:
 * - correoElectronico: string (viene en headers)
 * - casoID: number      (viene en headers)
 * - tipoInforme: string (viene en body)
 * - descripcionBreve: string (viene en body)
 * Devuelve el nuevo InformeID.
 */
export const agregarInforme = async (informe: Informe): Promise<number> => {
  const nuevoInformeID = await spAgregarInformeAlCaso(informe);
  return nuevoInformeID;
};

/**
 * Reasigna un caso. Devuelve el mensaje de motivo si falla o null si fue exitoso.
 * @returns string | null
 */
export const reasignarCaso = async (
    casoID: number,
    nuevoFiscalID: number
  ): Promise<string | null> => {
    return spReasignarCaso(casoID, nuevoFiscalID);
  };
