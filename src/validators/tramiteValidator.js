// src/validators/tramiteValidator.js
import { body, param } from "express-validator";

/**
 * Validaciones para crear un trámite
 */
export const validarCrearTramite = [
  body("formularioId")
    .notEmpty()
    .withMessage("El ID del formulario es obligatorio")
    .isString()
    .withMessage("El formularioId debe ser texto"),

  body("usuarioId")
    .notEmpty()
    .withMessage("El ID del usuario es obligatorio")
    .isString()
    .withMessage("El usuarioId debe ser texto"),

  body("usuarioNombre")
    .optional()
    .isString()
    .withMessage("El nombre del usuario debe ser texto"),

  body("respuestas")
    .notEmpty()
    .withMessage("Las respuestas son obligatorias")
    .isObject()
    .withMessage("Las respuestas deben ser un objeto"),

  body("estado")
    .optional()
    .isIn(["pendiente", "en_revision", "aprobado", "rechazado"])
    .withMessage("Estado inválido"),

  body("comentarios")
    .optional()
    .isString()
    .withMessage("Los comentarios deben ser texto"),
];

/**
 * Validaciones para actualizar un trámite
 */
export const validarActualizarTramite = [
  param("id")
    .notEmpty()
    .withMessage("El ID del trámite es obligatorio")
    .isString()
    .withMessage("El ID debe ser texto"),

  body("estado")
    .optional()
    .isIn(["pendiente", "en_revision", "aprobado", "rechazado"])
    .withMessage("Estado inválido"),

  body("comentarios")
    .optional()
    .isString()
    .withMessage("Los comentarios deben ser texto"),

  body("respuestas")
    .optional()
    .isObject()
    .withMessage("Las respuestas deben ser un objeto"),
];

/**
 * Validación para operaciones que requieren ID
 */
export const validarIdTramite = [
  param("id")
    .notEmpty()
    .withMessage("El ID del trámite es obligatorio")
    .isString()
    .withMessage("El ID debe ser texto")
    .isLength({ min: 10 })
    .withMessage("El ID del trámite no es válido"),
];
