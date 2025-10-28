// src/middlewares/autenticacion.js
import { auth } from "../config/firebase.js";
import authService from "../services/authService.js";

/**
 * Middleware para verificar que el usuario está autenticado
 * Verifica el token JWT de Firebase
 */
export const verificarToken = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token de autenticación no proporcionado",
      });
    }

    // Verificar formato: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido. Use: Bearer TOKEN",
      });
    }

    // Verificar token con Firebase
    const decodedToken = await auth.verifyIdToken(token);

    // Obtener información completa del usuario desde Firestore
    const usuario = await authService.obtenerUsuarioPorUid(decodedToken.uid);

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

    // Agregar información del usuario a la petición
    req.user = usuario;

    next();
  } catch (error) {
    console.error("❌ Error en verificarToken:", error);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        success: false,
        message: "Token expirado. Por favor, inicie sesión nuevamente",
      });
    }

    if (error.code === "auth/argument-error") {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }

    res.status(401).json({
      success: false,
      message: "Error al verificar token de autenticación",
      error: error.message,
    });
  }
};

/**
 * Middleware opcional: permite acceso con o sin autenticación
 * Si hay token, lo verifica; si no hay, continúa sin usuario
 */
export const verificarTokenOpcional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // No hay token, continuar sin usuario
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    // Hay token, verificarlo
    const decodedToken = await auth.verifyIdToken(token);
    const usuario = await authService.obtenerUsuarioPorUid(decodedToken.uid);

    req.user = usuario && usuario.activo ? usuario : null;

    next();
  } catch (error) {
    // Si hay error verificando el token, continuar sin usuario
    req.user = null;
    next();
  }
};
