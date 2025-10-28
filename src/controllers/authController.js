// src/controllers/authController.js
import authService from "../services/authService.js";

/**
 * Registrar un nuevo usuario
 * POST /api/auth/registro
 */
export const registrarUsuario = async (req, res) => {
  try {
    const { email, password, nombre, rol, municipio } = req.body;

    const nuevoUsuario = await authService.registrarUsuario({
      email,
      password,
      nombre,
      rol,
      municipio,
    });

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        uid: nuevoUsuario.uid,
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol,
        municipio: nuevoUsuario.municipio,
      },
    });
  } catch (error) {
    console.error("❌ Error en registrarUsuario:", error);

    // Errores específicos de Firebase Auth
    if (error.message.includes("email-already-exists")) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};

/**
 * Generar token personalizado para login
 * POST /api/auth/login
 *
 * Nota: Este endpoint genera un custom token que el cliente
 * debe intercambiar por un ID token usando el SDK de Firebase
 */
export const login = async (req, res) => {
  try {
    const { email } = req.body;

    // Obtener usuario por email
    const usuario = await authService.obtenerUsuarioPorEmail(email);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        message: "Usuario inactivo. Contacte al administrador",
      });
    }

    // Generar custom token
    const customToken = await authService.generarTokenPersonalizado(
      usuario.uid
    );

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      data: {
        customToken,
        usuario: {
          uid: usuario.uid,
          email: usuario.email,
          nombre: usuario.nombre,
          rol: usuario.rol,
          municipio: usuario.municipio,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /api/auth/perfil
 */
export const obtenerPerfil = async (req, res) => {
  try {
    // req.user ya viene del middleware verificarToken
    const usuario = req.user;

    res.status(200).json({
      success: true,
      message: "Perfil obtenido correctamente",
      data: {
        uid: usuario.uid,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        municipio: usuario.municipio,
        activo: usuario.activo,
        creadoEn: usuario.creadoEn,
        ultimoAcceso: usuario.ultimoAcceso,
      },
    });
  } catch (error) {
    console.error("❌ Error en obtenerPerfil:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener perfil",
      error: error.message,
    });
  }
};

/**
 * Listar todos los usuarios (solo superadmin)
 * GET /api/auth/usuarios
 */
export const listarUsuarios = async (req, res) => {
  try {
    const filtros = {};

    if (req.query.rol) {
      filtros.rol = req.query.rol;
    }

    if (req.query.municipio) {
      filtros.municipio = req.query.municipio;
    }

    if (req.query.activo !== undefined) {
      filtros.activo = req.query.activo === "true";
    }

    const usuarios = await authService.listarUsuarios(filtros);

    res.status(200).json({
      success: true,
      message: `Se encontraron ${usuarios.length} usuario(s)`,
      data: usuarios,
      total: usuarios.length,
    });
  } catch (error) {
    console.error("❌ Error en listarUsuarios:", error);
    res.status(500).json({
      success: false,
      message: "Error al listar usuarios",
      error: error.message,
    });
  }
};

/**
 * Actualizar un usuario (solo superadmin)
 * PUT /api/auth/usuarios/:uid
 */
export const actualizarUsuario = async (req, res) => {
  try {
    const { uid } = req.params;
    const datosActualizados = req.body;

    const usuarioActualizado = await authService.actualizarUsuario(
      uid,
      datosActualizados
    );

    res.status(200).json({
      success: true,
      message: "Usuario actualizado exitosamente",
      data: usuarioActualizado,
    });
  } catch (error) {
    console.error("❌ Error en actualizarUsuario:", error);

    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

/**
 * Eliminar (desactivar) un usuario (solo superadmin)
 * DELETE /api/auth/usuarios/:uid
 */
export const eliminarUsuario = async (req, res) => {
  try {
    const { uid } = req.params;

    const resultado = await authService.eliminarUsuario(uid);

    res.status(200).json({
      success: true,
      message: resultado.message,
      data: { uid: resultado.uid },
    });
  } catch (error) {
    console.error("❌ Error en eliminarUsuario:", error);

    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al eliminar usuario",
      error: error.message,
    });
  }
};
