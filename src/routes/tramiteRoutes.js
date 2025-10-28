// src/routes/tramiteRoutes.js
import express from "express";
import {
  crearTramite,
  obtenerTramites,
  obtenerTramitePorId,
  actualizarTramite,
  eliminarTramite,
  obtenerEstadisticas,
} from "../controllers/tramiteController.js";
import {
  validarCrearTramite,
  validarActualizarTramite,
  validarIdTramite,
} from "../validators/tramiteValidator.js";
import { validarResultados } from "../middlewares/validarResultados.js";

const router = express.Router();

/**
 * @route   POST /api/tramites
 * @desc    Crear un nuevo trámite (respuesta a un formulario)
 * @access  Público (después será solo usuarios autenticados)
 */
router.post("/", validarCrearTramite, validarResultados, crearTramite);

/**
 * @route   GET /api/tramites
 * @desc    Obtener todos los trámites (con filtros opcionales)
 * @access  Público (después será según rol)
 * @query   ?municipio=Coacalco&estado=pendiente&usuarioId=user123
 */
router.get("/", obtenerTramites);

/**
 * @route   GET /api/tramites/estadisticas
 * @desc    Obtener estadísticas de trámites
 * @access  Público (después será solo Admin y Super Admin)
 * @query   ?municipio=Coacalco
 */
router.get("/estadisticas", obtenerEstadisticas);

/**
 * @route   GET /api/tramites/:id
 * @desc    Obtener un trámite por ID
 * @access  Público (después será según rol y propietario)
 */
router.get("/:id", validarIdTramite, validarResultados, obtenerTramitePorId);

/**
 * @route   PUT /api/tramites/:id
 * @desc    Actualizar un trámite (cambiar estado, agregar comentarios)
 * @access  Público (después será solo Admin)
 */
router.put(
  "/:id",
  validarActualizarTramite,
  validarResultados,
  actualizarTramite
);

/**
 * @route   DELETE /api/tramites/:id
 * @desc    Eliminar un trámite permanentemente
 * @access  Público (después será solo Super Admin)
 */
router.delete("/:id", validarIdTramite, validarResultados, eliminarTramite);

export default router;
