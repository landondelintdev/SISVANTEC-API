// src/routes/authRoutes.js
import express from "express";
import {
  registrarUsuario,
  login,
  obtenerPerfil,
  listarUsuarios,
  actualizarUsuario,
  eliminarUsuario,
} from "../controllers/authController.js";
import {
  validarRegistro,
  validarLogin,
  validarActualizarUsuario,
} from "../validators/authValidator.js";
import { validarResultados } from "../middlewares/validarResultados.js";
import { verificarToken } from "../middlewares/autenticacion.js";
import { requiereRol } from "../middlewares/autorizacion.js";

const router = express.Router();

/**
 * @route   POST /api/auth/registro
 * @desc    Registrar un nuevo usuario (solo superadmin)
 * @access  Privado (Solo SuperAdmin)
 */
router.post(
  "/registro",
  verificarToken,
  requiereRol("superadmin"),
  validarRegistro,
  validarResultados,
  registrarUsuario
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión y obtener custom token
 * @access  Público
 *
 * Nota: Este endpoint devuelve un customToken que el cliente
 * debe intercambiar por un idToken usando Firebase Auth SDK:
 *
 * firebase.auth().signInWithCustomToken(customToken)
 */
router.post("/login", validarLogin, validarResultados, login);

/**
 * @route   GET /api/auth/perfil
 * @desc    Obtener perfil del usuario autenticado
 * @access  Privado (Usuario autenticado)
 */
router.get("/perfil", verificarToken, obtenerPerfil);

/**
 * @route   GET /api/auth/usuarios
 * @desc    Listar todos los usuarios (con filtros opcionales)
 * @access  Privado (Solo SuperAdmin)
 * @query   ?rol=admin&municipio=Coacalco&activo=true
 */
router.get(
  "/usuarios",
  verificarToken,
  requiereRol("superadmin"),
  listarUsuarios
);

/**
 * @route   PUT /api/auth/usuarios/:uid
 * @desc    Actualizar un usuario
 * @access  Privado (Solo SuperAdmin)
 */
router.put(
  "/usuarios/:uid",
  verificarToken,
  requiereRol("superadmin"),
  validarActualizarUsuario,
  validarResultados,
  actualizarUsuario
);

/**
 * @route   DELETE /api/auth/usuarios/:uid
 * @desc    Desactivar un usuario
 * @access  Privado (Solo SuperAdmin)
 */
router.delete(
  "/usuarios/:uid",
  verificarToken,
  requiereRol("superadmin"),
  eliminarUsuario
);

export default router;
