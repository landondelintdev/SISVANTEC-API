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

const router = express.Router();

router.post("/", validarCrearFormulario, validarResultados, crearFormulario);

router.get("/", obtenerFormularios);

router.get(
  "/:id",
  validarIdFormulario,
  validarResultados,
  obtenerFormularioPorId
);

router.put(
  "/:id",
  validarActualizarFormulario,
  validarResultados,
  actualizarFormulario
);

router.delete(
  "/:id",
  validarIdFormulario,
  validarResultados,
  eliminarFormulario
);

router.delete(
  "/:id/permanente",
  validarIdFormulario,
  validarResultados,
  eliminarFormularioPermanente
);

export default router;
