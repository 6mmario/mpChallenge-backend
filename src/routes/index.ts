import { Router, Request, Response } from 'express';
import { loginController } from '../controllers/authController';
import { crearCasoController } from '../controllers/casoController';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Base route working' });
});

router.post('/auth', loginController);

export default router;
