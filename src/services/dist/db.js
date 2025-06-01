"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.spAgregarInformeAlCaso = exports.spObtenerCasosPorCorreo = exports.spCrearCasoPorCorreo = exports.obtenerFiscalPorCorreoYContrasena = exports.getSqlPool = void 0;
// src/services/db.ts
var mssql_1 = require("mssql");
var sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    server: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 1433),
    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: true
    }
};
var pool = null;
exports.getSqlPool = function () { return __awaiter(void 0, void 0, Promise, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (pool)
                    return [2 /*return*/, pool];
                return [4 /*yield*/, new mssql_1["default"].ConnectionPool(sqlConfig).connect()];
            case 1:
                pool = _a.sent();
                return [2 /*return*/, pool];
        }
    });
}); };
/**
 * Este método invoca el SP usp_ObtenerFiscalPorCorreoYContrasena.
 * Recibe:
 *   - correo: string
 *   - contrasenaHash: string  (el hash que envía el cliente)
 * Devuelve un array de objetos con los campos que retorna el SELECT del SP.
 */
exports.obtenerFiscalPorCorreoYContrasena = function (correo, contrasenaHash) { return __awaiter(void 0, void 0, Promise, function () {
    var pool, request, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getSqlPool()];
            case 1:
                pool = _a.sent();
                request = pool.request();
                // Par�metros que espera el SP según tu definición:
                request.input("CorreoElectronico", mssql_1["default"].NVarChar(100), correo);
                request.input("Contrasena", mssql_1["default"].NVarChar(255), contrasenaHash);
                return [4 /*yield*/, request.execute("usp_ObtenerFiscalPorCorreoYContrasena")];
            case 2:
                result = _a.sent();
                // console.table(result.recordset)
                // recordset es el listado de filas devueltas
                return [2 /*return*/, result.recordset];
        }
    });
}); };
/**
 * Llama al procedimiento almacenado dbo.usp_CrearCasoPorCorreo.
 * Recibe:
 *   - correoElectronico: string
 *   - descripcion: string
 * Devuelve el nuevo CasoID generado (INT).
 */
exports.spCrearCasoPorCorreo = function (correoElectronico, descripcion) { return __awaiter(void 0, void 0, Promise, function () {
    var pool, request, result, nuevoID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getSqlPool()];
            case 1:
                pool = _a.sent();
                request = pool.request();
                request.input("CorreoElectronico", mssql_1["default"].NVarChar(100), correoElectronico);
                request.input("Descripcion", mssql_1["default"].NVarChar(mssql_1["default"].MAX), descripcion);
                request.output("NuevoCasoID", mssql_1["default"].Int);
                return [4 /*yield*/, request.execute("dbo.usp_CrearCasoPorCorreo")];
            case 2:
                result = _a.sent();
                nuevoID = result.output.NuevoCasoID;
                if (!nuevoID) {
                    throw new Error("No se pudo obtener el ID del nuevo caso.");
                }
                return [2 /*return*/, nuevoID];
        }
    });
}); };
/**
 * Llama al procedimiento almacenado dbo.usp_ObtenerCasosPorCorreo.
 * Recibe:
 *   - correoElectronico: string
 * Devuelve un array de objetos con los campos CasoID, FechaRegistro, Estado, Progreso, Descripcion, FechaUltimaActualizacion y FiscalID.
 */
exports.spObtenerCasosPorCorreo = function (correoElectronico) { return __awaiter(void 0, void 0, Promise, function () {
    var pool, request, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getSqlPool()];
            case 1:
                pool = _a.sent();
                request = pool.request();
                request.input("CorreoElectronico", mssql_1["default"].NVarChar(100), correoElectronico);
                return [4 /*yield*/, request.execute("dbo.usp_ObtenerCasosPorCorreo")];
            case 2:
                result = _a.sent();
                return [2 /*return*/, result.recordset];
        }
    });
}); };
/**
 * Llama al procedimiento almacenado dbo.usp_AgregarInformeAlCaso.
 * Recibe:
 *   - correoElectronico: string
 *   - casoID: number
 *   - tipoInforme: string
 *   - descripcionBreve: string
 * Devuelve el nuevo InformeID generado (INT).
 */
exports.spAgregarInformeAlCaso = function (informe) { return __awaiter(void 0, void 0, Promise, function () {
    var pool, request, result, nuevoInformeID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getSqlPool()];
            case 1:
                pool = _a.sent();
                request = pool.request();
                request.input("CorreoElectronico", mssql_1["default"].NVarChar(100), informe.correoElectronico);
                request.input("CasoID", mssql_1["default"].Int, informe.casoID);
                request.input("TipoInforme", mssql_1["default"].NVarChar(100), informe.TipoInforme);
                request.input("DescripcionBreve", mssql_1["default"].NVarChar(255), informe.DescripcionBreve);
                request.input("Estado", mssql_1["default"].NVarChar(50), informe.Estado);
                request.input("Progreso", mssql_1["default"].NVarChar(50), informe.Progreso);
                request.output("NuevoInformeID", mssql_1["default"].Int);
                return [4 /*yield*/, request.execute("dbo.usp_AgregarInformeAlCaso")];
            case 2:
                result = _a.sent();
                nuevoInformeID = result.output.NuevoInformeID;
                if (!nuevoInformeID) {
                    throw new Error("No se pudo obtener el ID del nuevo informe.");
                }
                return [2 /*return*/, nuevoInformeID];
        }
    });
}); };
