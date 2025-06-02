// src/routes/fiscales.ts
import { Router } from 'express';
import { listarFiscalesController } from '../controllers/fiscalController';

const fiscalesRouter = Router();

// GET /api/fiscales
fiscalesRouter.get('/', listarFiscalesController);

export default fiscalesRouter;