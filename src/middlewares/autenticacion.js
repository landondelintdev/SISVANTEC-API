// src/middlewares/autorizacion.js

/**
 * Middleware para verificar que el usuario tiene uno de los roles permitidos
 * @param {...string} rolesPermitidos - Lista de roles que pueden acceder
 * @returns {Function} Middleware de Express
 */
export const requiereRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    // Verificar que tenga uno de los roles permitidos
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(
          ", "
        )}`,
        tuRol: req.user.rol,
      });
    }

    next();
  };
};

/**
 * Middleware para verificar que el admin solo acceda a su municipio
 * Super Admin puede acceder a cualquier municipio
 */
export const verificarAccesoMunicipio = (req, res, next) => {
  const usuario = req.user;

  // Super Admin tiene acceso a todo
  if (usuario.rol === "superadmin") {
    return next();
  }

  // Usuarios finales no necesitan municipio
  if (usuario.rol === "usuario") {
    return next();
  }

  // Admin solo puede acceder a su municipio
  if (usuario.rol === "admin") {
    // Obtener el municipio del recurso solicitado
    const municipioRecurso =
      req.body.municipio || // POST/PUT
      req.params.municipio || // URL params
      req.query.municipio; // Query params

    // Si no se especifica municipio en la petición, permitir
    // (lo validaremos en el controlador según sea necesario)
    if (!municipioRecurso) {
      return next();
    }

    // Verificar que el municipio coincida
    if (municipioRecurso !== usuario.municipio) {
      return res.status(403).json({
        success: false,
        message: `No tienes permiso para acceder a recursos de ${municipioRecurso}. Solo puedes gestionar ${usuario.municipio}`,
      });
    }
  }

  next();
};

/**
 * Middleware para verificar que un usuario solo acceda a sus propios recursos
 * Admins y SuperAdmins pueden acceder a cualquier recurso
 */
export const verificarPropietario = (campoUserId = "usuarioId") => {
  return async (req, res, next) => {
    const usuario = req.user;

    // SuperAdmin y Admin pueden ver todo
    if (usuario.rol === "superadmin" || usuario.rol === "admin") {
      return next();
    }

    // Usuarios finales solo pueden ver sus propios recursos
    if (usuario.rol === "usuario") {
      const recursoUserId =
        req.body[campoUserId] || req.params.usuarioId || req.query.usuarioId;

      if (recursoUserId && recursoUserId !== usuario.uid) {
        return res.status(403).json({
          success: false,
          message: "Solo puedes acceder a tus propios recursos",
        });
      }
    }

    next();
  };
};

/**
 * Middleware para verificar acceso a un trámite específico
 * - SuperAdmin: acceso a todo
 * - Admin: solo trámites de su municipio
 * - Usuario: solo sus propios trámites
 */
export const verificarAccesoTramite = async (req, res, next) => {
  try {
    const usuario = req.user;
    const tramiteId = req.params.id;

    // SuperAdmin tiene acceso a todo
    if (usuario.rol === "superadmin") {
      return next();
    }

    // Obtener el trámite de Firestore
    const { db } = await import("../config/firebase.js");
    const tramiteDoc = await db.collection("tramites").doc(tramiteId).get();

    if (!tramiteDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Trámite no encontrado",
      });
    }

    const tramite = tramiteDoc.data();

    // Admin: verificar que el trámite sea de su municipio
    if (usuario.rol === "admin") {
      if (tramite.municipio !== usuario.municipio) {
        return res.status(403).json({
          success: false,
          message: `Este trámite pertenece a ${tramite.municipio}. Solo puedes gestionar trámites de ${usuario.municipio}`,
        });
      }
      return next();
    }

    // Usuario: verificar que sea el propietario del trámite
    if (usuario.rol === "usuario") {
      if (tramite.usuarioId !== usuario.uid) {
        return res.status(403).json({
          success: false,
          message: "Solo puedes acceder a tus propios trámites",
        });
      }
      return next();
    }

    next();
  } catch (error) {
    console.error("❌ Error en verificarAccesoTramite:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar permisos del trámite",
      error: error.message,
    });
  }
};

/**
 * Middleware para verificar acceso a un formulario específico
 * - SuperAdmin: acceso a todo
 * - Admin: solo formularios de su municipio
 * - Usuario: solo lectura de formularios activos
 */
export const verificarAccesoFormulario = async (req, res, next) => {
  try {
    const usuario = req.user;
    const formularioId = req.params.id;

    // SuperAdmin tiene acceso a todo
    if (usuario.rol === "superadmin") {
      return next();
    }

    // Obtener el formulario de Firestore
    const { db } = await import("../config/firebase.js");
    const formularioDoc = await db
      .collection("formularios")
      .doc(formularioId)
      .get();

    if (!formularioDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Formulario no encontrado",
      });
    }

    const formulario = formularioDoc.data();

    // Admin: verificar que el formulario sea de su municipio
    if (usuario.rol === "admin") {
      if (formulario.municipio !== usuario.municipio) {
        return res.status(403).json({
          success: false,
          message: `Este formulario pertenece a ${formulario.municipio}. Solo puedes gestionar formularios de ${usuario.municipio}`,
        });
      }
      return next();
    }

    // Usuario: solo lectura de formularios activos
    if (usuario.rol === "usuario") {
      // Solo pueden ver, no modificar
      if (req.method !== "GET") {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para modificar formularios",
        });
      }

      // Solo formularios activos
      if (!formulario.activo) {
        return res.status(403).json({
          success: false,
          message: "Este formulario no está disponible",
        });
      }

      return next();
    }

    next();
  } catch (error) {
    console.error("❌ Error en verificarAccesoFormulario:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar permisos del formulario",
      error: error.message,
    });
  }
};
