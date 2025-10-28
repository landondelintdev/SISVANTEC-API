// src/validators/formularioValidator.js
import { body, param } from "express-validator";

export const validarCrearFormulario = [
  body("titulo")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isString()
    .withMessage("El título debe ser texto")
    .isLength({ min: 3, max: 100 })
    .withMessage("El título debe tener entre 3 y 100 caracteres"),

  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar 500 caracteres"),

  body("campos")
    .notEmpty()
    .withMessage("El formulario debe tener al menos un campo")
    .isArray({ min: 1 })
    .withMessage("Los campos deben ser un array con al menos un elemento"),

  body("campos.*.nombre")
    .notEmpty()
    .withMessage("Cada campo debe tener un nombre")
    .isString()
    .withMessage("El nombre del campo debe ser texto"),

  body("campos.*.tipo")
    .notEmpty()
    .withMessage("Cada campo debe tener un tipo")
    .isIn(["text", "number", "email", "date", "select", "textarea", "checkbox"])
    .withMessage("Tipo de campo inválido"),

  body("campos.*.etiqueta")
    .notEmpty()
    .withMessage("Cada campo debe tener una etiqueta")
    .isString()
    .withMessage("La etiqueta debe ser texto"),

  body("campos.*.requerido")
    .optional()
    .isBoolean()
    .withMessage("El campo 'requerido' debe ser true o false"),

  body("activo")
    .optional()
    .isBoolean()
    .withMessage("El campo 'activo' debe ser true o false"),

  body("creadoPor")
    .notEmpty()
    .withMessage("Debe especificar quién crea el formulario")
    .isString()
    .withMessage("creadoPor debe ser texto"),

  body("municipio")
    .notEmpty()
    .withMessage("Debe especificar el municipio")
    .isString()
    .withMessage("El municipio debe ser texto"),
];

export const validarActualizarFormulario = [
  param("id")
    .notEmpty()
    .withMessage("El ID del formulario es obligatorio")
    .isString()
    .withMessage("El ID debe ser texto"),

  body("titulo")
    .optional()
    .isString()
    .withMessage("El título debe ser texto")
    .isLength({ min: 3, max: 100 })
    .withMessage("El título debe tener entre 3 y 100 caracteres"),

  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ max: 500 })
    .withMessage("La descripción no puede superar 500 caracteres"),

  body("campos")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Los campos deben ser un array con al menos un elemento"),

  body("activo")
    .optional()
    .isBoolean()
    .withMessage("El campo 'activo' debe ser true o false"),

  body("municipio")
    .optional()
    .isString()
    .withMessage("El municipio debe ser texto"),
];

export const validarIdFormulario = [
  param("id")
    .notEmpty()
    .withMessage("El ID del formulario es obligatorio")
    .isString()
    .withMessage("El ID debe ser texto")
    .isLength({ min: 10 })
    .withMessage("El ID del formulario no es válido"),
];
