// src/controllers/tramiteController.js
import tramiteService from "../services/tramiteService.js";

export const crearTramite = async (req, res) => {
  try {
    const {
      formularioId,
      usuarioId,
      usuarioNombre,
      respuestas,
      estado,
      comentarios,
    } = req.body;

    const nuevoTramite = await tramiteService.crearTramite({
      formularioId,
      usuarioId,
      usuarioNombre,
      respuestas,
      estado,
      comentarios,
    });

    res.status(201).json({
      success: true,
      message: "Trámite creado exitosamente",
      data: nuevoTramite,
    });
  } catch (error) {
    console.error("❌ Error en crearTramite:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear el trámite",
      error: error.message,
    });
  }
};

export const obtenerTramites = async (req, res) => {
  try {
    const filtros = {};

    if (req.query.municipio) {
      filtros.municipio = req.query.municipio;
    }

    if (req.query.usuarioId) {
      filtros.usuarioId = req.query.usuarioId;
    }

    if (req.query.formularioId) {
      filtros.formularioId = req.query.formularioId;
    }

    if (req.query.estado) {
      filtros.estado = req.query.estado;
    }

    const tramites = await tramiteService.obtenerTramites(filtros);

    res.status(200).json({
      success: true,
      message: `Se encontraron ${tramites.length} trámite(s)`,
      data: tramites,
      total: tramites.length,
    });
  } catch (error) {
    console.error("❌ Error en obtenerTramites:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los trámites",
      error: error.message,
    });
  }
};

export const obtenerTramitePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const tramite = await tramiteService.obtenerTramitePorId(id);

    if (!tramite) {
      return res.status(404).json({
        success: false,
        message: "Trámite no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trámite encontrado",
      data: tramite,
    });
  } catch (error) {
    console.error("❌ Error en obtenerTramitePorId:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el trámite",
      error: error.message,
    });
  }
};

export const actualizarTramite = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const tramiteActualizado = await tramiteService.actualizarTramite(
      id,
      datosActualizados
    );

    res.status(200).json({
      success: true,
      message: "Trámite actualizado exitosamente",
      data: tramiteActualizado,
    });
  } catch (error) {
    console.error("❌ Error en actualizarTramite:", error);

    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al actualizar el trámite",
      error: error.message,
    });
  }
};

export const eliminarTramite = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await tramiteService.eliminarTramite(id);

    res.status(200).json({
      success: true,
      message: resultado.message,
      data: { id: resultado.id },
    });
  } catch (error) {
    console.error("❌ Error en eliminarTramite:", error);

    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al eliminar el trámite",
      error: error.message,
    });
  }
};

export const obtenerEstadisticas = async (req, res) => {
  try {
    const { municipio } = req.query;

    const estadisticas = await tramiteService.obtenerEstadisticas(municipio);

    res.status(200).json({
      success: true,
      message: "Estadísticas obtenidas correctamente",
      data: estadisticas,
    });
  } catch (error) {
    console.error("❌ Error en obtenerEstadisticas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};
