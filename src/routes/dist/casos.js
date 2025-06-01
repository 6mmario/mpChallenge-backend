"use strict";
exports.__esModule = true;
var express_1 = require("express");
var casoController_1 = require("../controllers/casoController");
var casos = express_1.Router();
casos.get('/', casoController_1.listarCasosController);
casos.post('/nuevo', casoController_1.crearCasoController);
casos.post('/informe', casoController_1.agregarInformeController);
exports["default"] = casos;
