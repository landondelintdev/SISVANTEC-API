// src/controllers/formularioController.js
import formularioService from "../services/formularioService.js";

// src/controllers/formularioController.js

export const crearFormulario = async (req, res) => {
  try {
    const { titulo, descripcion, campos, activo, municipio } = req.body;

    // Usar información del usuario autenticado
    const usuario = req.user;

    const nuevoFormulario = await formularioService.crearFormulario({
      titulo,
      descripcion,
      campos,
      activo,
      creadoPor: usuario.uid, // ← Usuario autenticado
      municipio: usuario.rol === "admin" ? usuario.municipio : municipio, // ← Admin usa su municipio
    });

    res.status(201).json({
      success: true,
      message: "Formulario creado exitosamente",
      data: nuevoFormulario,
    });
  } catch (error) {
    console.error("❌ Error en crearFormulario:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear el formulario",
      error: error.message,
    });
  }
};

// Actualizar obtenerFormularios para filtrar según rol
export const obtenerFormularios = async (req, res) => {
  try {
    const filtros = {};
    const usuario = req.user;

    // Filtros según rol
    if (usuario) {
      if (usuario.rol === "admin") {
        // Admin solo ve formularios de su municipio
        filtros.municipio = usuario.municipio;
      }
      // SuperAdmin ve todo
      // Usuario ve todo (solo activos se filtran en el servicio)
    }

    // Aplicar filtros adicionales de query params
    if (req.query.activo !== undefined) {
      filtros.activo = req.query.activo === "true";
    }

    if (req.query.municipio && usuario?.rol === "superadmin") {
      filtros.municipio = req.query.municipio;
    }

    if (req.query.creadoPor && usuario?.rol === "superadmin") {
      filtros.creadoPor = req.query.creadoPor;
    }

    const formularios = await formularioService.obtenerFormularios(filtros);

    res.status(200).json({
      success: true,
      message: `Se encontraron ${formularios.length} formulario(s)`,
      data: formularios,
      total: formularios.length,
    });
  } catch (error) {
    console.error("❌ Error en obtenerFormularios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los formularios",
      error: error.message,
    });
  }
};

// ... (resto de funciones sin cambios)
export const obtenerFormularioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const formulario = await formularioService.obtenerFormularioPorId(id);

    if (!formulario) {
      return res.status(404).json({
        success: false,
        message: "Formulario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Formulario encontrado",
      data: formulario,
    });
  } catch (error) {
    console.error("❌ Error en obtenerFormularioPorId:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el formulario",
      error: error.message,
    });
  }
};

export const actualizarFormulario = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;

    const formularioActualizado = await formularioService.actualizarFormulario(
      id,
      datosActualizados
    );

    res.status(200).json({
      success: true,
      message: "Formulario actualizado exitosamente",
      data: formularioActualizado,
    });
  } catch (error) {
    console.error("❌ Error en actualizarFormulario:", error);

    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al actualizar el formulario",
      error: error.message,
    });
  }
};

export const eliminarFormulario = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await formularioService.eliminarFormulario(id);

    res.status(200).json({
      success: true,
      message: resultado.message,
      data: { id: resultado.id },
    });
  } catch (error) {
    console.error("❌ Error en eliminarFormulario:", error);

    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al eliminar el formulario",
      error: error.message,
    });
  }
};

export const eliminarFormularioPermanente = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await formularioService.eliminarFormularioPermanente(id);

    res.status(200).json({
      success: true,
      message: resultado.message,
      data: { id: resultado.id },
    });
  } catch (error) {
    console.error("❌ Error en eliminarFormularioPermanente:", error);

    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al eliminar permanentemente el formulario",
      error: error.message,
    });
  }
};
