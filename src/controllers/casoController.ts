// src/controllers/casoController.ts
import { Request, Response, NextFunction } from 'express';
import { agregarInforme, crearCasoPorCorreo, listarCasos } from '../services/casoService';
import { Informe } from '../models/Informe';
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

/**
 * POST /api/informe
 * Header esperado:
 *   - correoElectronico: string
 *   - idCaso: number
 * Body esperado:
 *   - tipoInforme: string
 *   - descripcionBreve: string
 *
 * Devuelve el nuevo InformeID en JSON.
 */
export const agregarInformeController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1) Extraer ID del caso y correo del fiscal de los headers
    const correoElectronico = req.header('correoElectronico');
    const idCasoHeader = req.header('idCaso');

    if (!correoElectronico || !idCasoHeader) {
      res.status(400).json({ mensaje: 'Falta correoElectronico o idCaso en headers.' });
      return;
    }

    const casoID = parseInt(idCasoHeader, 10);
    if (isNaN(casoID)) {
      res.status(400).json({ mensaje: 'idCaso debe ser un número válido.' });
      return;
    }

    // 2) Extraer tipoInforme y descripcionBreve del body
    const informe: Informe = req.body;

    if (!informe.TipoInforme || !informe.DescripcionBreve) {
      res.status(400).json({ mensaje: 'Faltan tipoInforme o descripcionBreve en body.' });
      return;
    }

    informe.casoID = casoID;
    informe.correoElectronico = correoElectronico;

    // 3) Llamar al service para agregar el informe
    const nuevoInformeID = await agregarInforme(informe);

    res.status(201).json({
      mensaje: 'Informe agregado exitosamente',
      nuevoInformeID,
    });
  } catch (error: any) {
    // Si el SP lanzó RAISERROR o hubo otro fallo, respondo 500 con el mensaje
    res.status(500).json({ mensaje: error.message || 'Error al agregar informe' });
  }
};