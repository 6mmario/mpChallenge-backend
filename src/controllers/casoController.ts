// src/controllers/casoController.ts
import { Request, Response, NextFunction } from 'express';
import { crearCasoPorCorreo, listarCasos } from '../services/casoService';
/**
 * POST /api/casos
 * Body esperado: { correoElectronico: string, descripcion: string }
 */
export const crearCasoController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { correoElectronico, descripcion } = req.body as {
      correoElectronico?: string;
      descripcion?: string;
    };

    // Validaciones básicas
    if (!correoElectronico || !descripcion) {
      res.status(400).json({ mensaje: 'Faltan correoElectronico o descripcion.' });
      return;
    }

    // Llamamos al service para crear el caso y obtener el nuevo CasoID
    const nuevoCasoID = await crearCasoPorCorreo(correoElectronico, descripcion);

    res.status(201).json({
      mensaje: 'Caso creado exitosamente',
      nuevoCasoID,
    });
  } catch (error: any) {
    // Si el SP lanza RAISERROR o hay otro problema
    res.status(500).json({ mensaje: error.message || 'Error al crear el caso' });
  }
};

/**
 * GET /api/casos
 * Retorna todos los casos.
 */
export const listarCasosController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const correoElectronico = req.header('correoElectronico');
    console.log(correoElectronico)
    if (!correoElectronico) {
      res.status(400).json({ mensaje: 'Falta correoElectronico en headers.' });
      return;
    }
    const casos: Caso[] = await listarCasos(correoElectronico);
    res.status(200).json(casos);
  } catch (error: any) {
    res.status(500).json({ mensaje: error.message || 'Error al obtener los casos' });
  }
};