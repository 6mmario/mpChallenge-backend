// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { loginFiscal } from '../services/authService';

/**
 * POST /api/auth/login
 * Body esperado: { correo: string, password: string }
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { correo, password } = req.body as {
      correo?: string;
      password?: string;
    };

    // Validaciones básicas:
    if (!correo || !password) {
      res.status(400).json({ mensaje: 'Faltan correo o contraseña.' });
      return;
    }

    // Llamamos al service que invoca al SP
    const fiscal: Fiscal = await loginFiscal(correo, password);

    // Si llegamos hasta aquí, la autenticación fue exitosa
    // (aquí podrías generar un JWT si lo deseas, pero no lo abordamos ahora):
    res.status(200).json(fiscal);
  } catch (error: any) {
    res
      .status(401)
      .json({ mensaje: error.message || 'Error de autenticación' });
  }
};