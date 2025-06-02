// src/controllers/fiscalController.ts
import { Request, Response, NextFunction } from 'express';
import { listarFiscales } from '../services/fiscalService';

/**
 * GET /api/fiscales
 * Retorna un array de objetos Fiscal.
 */
export const listarFiscalesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const fiscales: Fiscal[] = await listarFiscales();
    res.status(200).json(fiscales);
  } catch (error: any) {
    res.status(500).json({ mensaje: error.message || 'Error al obtener los fiscales' });
  }
};