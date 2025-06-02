import { Router, Request, Response } from 'express';
import { agregarInformeController, crearCasoController, listarCasosController, reasignarCasoController } from '../controllers/casoController';

const casos = Router();

casos.get('/', listarCasosController);
casos.post('/nuevo', crearCasoController);
casos.post('/informe', agregarInformeController)
casos.post('/reasignar', reasignarCasoController);

export default casos;
