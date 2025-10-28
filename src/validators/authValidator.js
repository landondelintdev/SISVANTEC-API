// src/validators/authValidator.js
import { body } from "express-validator";

/**
 * Validaciones para registro de usuarios
 */
export const validarRegistro = [
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isString()
    .withMessage("El nombre debe ser texto")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres"),

  body("rol")
    .notEmpty()
    .withMessage("El rol es obligatorio")
    .isIn(["superadmin", "admin", "usuario"])
    .withMessage("Rol inválido. Debe ser: superadmin, admin o usuario"),

  body("municipio")
    .optional()
    .isString()
    .withMessage("El municipio debe ser texto")
    .trim(),

  // Validación condicional: admin debe tener municipio
  body("municipio").custom((value, { req }) => {
    if (req.body.rol === "admin" && !value) {
      throw new Error("Los administradores deben tener un municipio asignado");
    }
    return true;
  }),
];

/**
 * Validaciones para login
 */
export const validarLogin = [
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

/**
 * Validaciones para actualizar usuario
 */
export const validarActualizarUsuario = [
  body("nombre")
    .optional()
    .isString()
    .withMessage("El nombre debe ser texto")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("El nombre debe tener entre 3 y 100 caracteres"),

  body("rol")
    .optional()
    .isIn(["superadmin", "admin", "usuario"])
    .withMessage("Rol inválido. Debe ser: superadmin, admin o usuario"),

  body("municipio")
    .optional()
    .isString()
    .withMessage("El municipio debe ser texto")
    .trim(),

  body("activo")
    .optional()
    .isBoolean()
    .withMessage("activo debe ser true o false"),
];
