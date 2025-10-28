// src/routes/formularioRoutes.js
import express from "express";
import {
  crearFormulario,
  obtenerFormularios,
  obtenerFormularioPorId,
  actualizarFormulario,
  eliminarFormulario,
  eliminarFormularioPermanente,
} from "../controllers/formularioController.js";
import {
  validarCrearFormulario,
  validarActualizarFormulario,
  validarIdFormulario,
} from "../validators/formularioValidator.js";
import { validarResultados } from "../middlewares/validarResultados.js";
import {
  verificarToken,
  verificarTokenOpcional,
} from "../middlewares/autenticacion.js";
import {
  requiereRol,
  verificarAccesoMunicipio,
  verificarAccesoFormulario,
} from "../middlewares/autorizacion.js";

const router = express.Router();

/**
 * @route   POST /api/formularios
 * @desc    Crear un nuevo formulario
 * @access  Privado (Admin y SuperAdmin)
 */
router.post(
  "/",
  verificarToken,
  requiereRol("admin", "superadmin"),
  verificarAccesoMunicipio,
  validarCrearFormulario,
  validarResultados,
  crearFormulario
);

/**
 * @route   GET /api/formularios
 * @desc    Obtener todos los formularios
 * @access  Público con filtros según rol
 * @query   ?activo=true&municipio=Coacalco
 */
router.get("/", verificarTokenOpcional, obtenerFormularios);

/**
 * @route   GET /api/formularios/:id
 * @desc    Obtener un formulario por ID
 * @access  Público (pero validado según estado)
 */
router.get(
  "/:id",
  verificarTokenOpcional,
  validarIdFormulario,
  validarResultados,
  obtenerFormularioPorId
);

/**
 * @route   PUT /api/formularios/:id
 * @desc    Actualizar un formulario
 * @access  Privado (Admin y SuperAdmin del mismo municipio)
 */
router.put(
  "/:id",
  verificarToken,
  requiereRol("admin", "superadmin"),
  verificarAccesoFormulario,
  validarActualizarFormulario,
  validarResultados,
  actualizarFormulario
);

/**
 * @route   DELETE /api/formularios/:id
 * @desc    Eliminar formulario (borrado lógico)
 * @access  Privado (Admin y SuperAdmin del mismo municipio)
 */
router.delete(
  "/:id",
  verificarToken,
  requiereRol("admin", "superadmin"),
  verificarAccesoFormulario,
  validarIdFormulario,
  validarResultados,
  eliminarFormulario
);

/**
 * @route   DELETE /api/formularios/:id/permanente
 * @desc    Eliminar formulario permanentemente
 * @access  Privado (Solo SuperAdmin)
 */
router.delete(
  "/:id/permanente",
  verificarToken,
  requiereRol("superadmin"),
  validarIdFormulario,
  validarResultados,
  eliminarFormularioPermanente
);

export default router;
