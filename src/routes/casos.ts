import { Router, Request, Response } from 'express';
import { crearCasoController, listarCasosController } from '../controllers/casoController';

const casos = Router();

casos.get('/', listarCasosController);
casos.post('/nuevo', crearCasoController);

export default casos;
