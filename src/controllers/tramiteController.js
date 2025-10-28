// src/controllers/tramiteController.js
import tramiteService from "../services/tramiteService.js";

/**
 * Crear un nuevo trámite (respuesta a un formulario)
 * POST /api/tramites
 */
export const crearTramite = async (req, res) => {
  try {
    const { formularioId, respuestas, usuarioNombre } = req.body;

    // Usar información del usuario autenticado
    const usuario = req.user;

    const nuevoTramite = await tramiteService.crearTramite({
      formularioId,
      usuarioId: usuario.uid, // ← Usuario autenticado
      usuarioNombre: usuarioNombre || usuario.nombre,
      respuestas,
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

/**
 * Obtener todos los trámites (filtrados según rol)
 * GET /api/tramites
 */
export const obtenerTramites = async (req, res) => {
  try {
    const filtros = {};
    const usuario = req.user;

    // Filtros automáticos según rol
    if (usuario.rol === "admin") {
      // Admin solo ve trámites de su municipio
      filtros.municipio = usuario.municipio;
    } else if (usuario.rol === "usuario") {
      // Usuario solo ve sus propios trámites
      filtros.usuarioId = usuario.uid;
    }
    // SuperAdmin ve todo

    // Aplicar filtros adicionales solo si es SuperAdmin o Admin
    if (usuario.rol === "superadmin" || usuario.rol === "admin") {
      if (req.query.municipio && usuario.rol === "superadmin") {
        filtros.municipio = req.query.municipio;
      }

      if (req.query.formularioId) {
        filtros.formularioId = req.query.formularioId;
      }

      if (req.query.estado) {
        filtros.estado = req.query.estado;
      }

      if (req.query.usuarioId && usuario.rol === "superadmin") {
        filtros.usuarioId = req.query.usuarioId;
      }
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

/**
 * Obtener un trámite por ID
 * GET /api/tramites/:id
 */
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

/**
 * Actualizar un trámite
 * PUT /api/tramites/:id
 */
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

/**
 * Eliminar un trámite permanentemente
 * DELETE /api/tramites/:id
 */
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

/**
 * Obtener estadísticas de trámites
 * GET /api/tramites/estadisticas
 */
export const obtenerEstadisticas = async (req, res) => {
  try {
    const usuario = req.user;
    let municipio = req.query.municipio;

    // Admin solo puede ver estadísticas de su municipio
    if (usuario.rol === "admin") {
      municipio = usuario.municipio;
    }

    const estadisticas = await tramiteService.obtenerEstadisticas(municipio);

    res.status(200).json({
      success: true,
      message: "Estadísticas obtenidas correctamente",
      data: estadisticas,
      municipio: municipio || "Todos",
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
