// src/services/authService.js
import { admin, db, auth } from "../config/firebase.js";

const USUARIOS_COLLECTION = "usuarios";

/**
 * Servicio para gestionar autenticación y usuarios
 */
class AuthService {
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} - Usuario creado
   */
  async registrarUsuario(userData) {
    try {
      const { email, password, nombre, rol, municipio } = userData;

      // Validar que el rol sea válido
      const rolesValidos = ["superadmin", "admin", "usuario"];
      if (!rolesValidos.includes(rol)) {
        throw new Error(`Rol inválido. Debe ser: ${rolesValidos.join(", ")}`);
      }

      // Validar que admin tenga municipio
      if (rol === "admin" && !municipio) {
        throw new Error(
          "Los administradores deben tener un municipio asignado"
        );
      }

      // Crear usuario en Firebase Authentication
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: nombre,
      });

      // Crear documento en Firestore
      const usuarioData = {
        uid: userRecord.uid,
        email,
        nombre,
        rol,
        municipio: rol === "admin" ? municipio : null,
        activo: true,
        creadoEn: new Date().toISOString(),
        ultimoAcceso: null,
      };

      await db
        .collection(USUARIOS_COLLECTION)
        .doc(userRecord.uid)
        .set(usuarioData);

      return {
        uid: userRecord.uid,
        ...usuarioData,
      };
    } catch (error) {
      console.error("❌ Error en registrarUsuario:", error);
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }

  /**
   * Obtener información de un usuario por UID
   * @param {string} uid - UID del usuario
   * @returns {Promise<Object|null>} - Datos del usuario
   */
  async obtenerUsuarioPorUid(uid) {
    try {
      const doc = await db.collection(USUARIOS_COLLECTION).doc(uid).get();

      if (!doc.exists) {
        return null;
      }

      return {
        uid: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      console.error("❌ Error en obtenerUsuarioPorUid:", error);
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Obtener información de un usuario por email
   * @param {string} email - Email del usuario
   * @returns {Promise<Object|null>} - Datos del usuario
   */
  async obtenerUsuarioPorEmail(email) {
    try {
      const snapshot = await db
        .collection(USUARIOS_COLLECTION)
        .where("email", "==", email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        uid: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      console.error("❌ Error en obtenerUsuarioPorEmail:", error);
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Actualizar último acceso del usuario
   * @param {string} uid - UID del usuario
   * @returns {Promise<void>}
   */
  async actualizarUltimoAcceso(uid) {
    try {
      await db.collection(USUARIOS_COLLECTION).doc(uid).update({
        ultimoAcceso: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Error en actualizarUltimoAcceso:", error);
      // No lanzamos error aquí para no interrumpir el login
    }
  }

  /**
   * Listar todos los usuarios (solo para superadmin)
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise<Array>} - Lista de usuarios
   */
  async listarUsuarios(filtros = {}) {
    try {
      let query = db.collection(USUARIOS_COLLECTION);

      if (filtros.rol) {
        query = query.where("rol", "==", filtros.rol);
      }

      if (filtros.municipio) {
        query = query.where("municipio", "==", filtros.municipio);
      }

      if (filtros.activo !== undefined) {
        query = query.where("activo", "==", filtros.activo);
      }

      const snapshot = await query.get();

      const usuarios = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();
        // No incluir información sensible
        usuarios.push({
          uid: doc.id,
          email: userData.email,
          nombre: userData.nombre,
          rol: userData.rol,
          municipio: userData.municipio,
          activo: userData.activo,
          creadoEn: userData.creadoEn,
          ultimoAcceso: userData.ultimoAcceso,
        });
      });

      return usuarios;
    } catch (error) {
      console.error("❌ Error en listarUsuarios:", error);
      throw new Error(`Error al listar usuarios: ${error.message}`);
    }
  }

  /**
   * Actualizar rol o municipio de un usuario
   * @param {string} uid - UID del usuario
   * @param {Object} datosActualizados - Datos a actualizar
   * @returns {Promise<Object>} - Usuario actualizado
   */
  async actualizarUsuario(uid, datosActualizados) {
    try {
      const docRef = db.collection(USUARIOS_COLLECTION).doc(uid);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Usuario no encontrado");
      }

      // Validar campos permitidos
      const camposPermitidos = ["nombre", "rol", "municipio", "activo"];
      const actualizacion = {};

      for (const [key, value] of Object.entries(datosActualizados)) {
        if (camposPermitidos.includes(key)) {
          actualizacion[key] = value;
        }
      }

      if (Object.keys(actualizacion).length === 0) {
        throw new Error("No hay campos válidos para actualizar");
      }

      await docRef.update(actualizacion);

      const docActualizado = await docRef.get();
      return {
        uid: docActualizado.id,
        ...docActualizado.data(),
      };
    } catch (error) {
      console.error("❌ Error en actualizarUsuario:", error);
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  /**
   * Eliminar (desactivar) un usuario
   * @param {string} uid - UID del usuario
   * @returns {Promise<Object>} - Confirmación
   */
  async eliminarUsuario(uid) {
    try {
      const docRef = db.collection(USUARIOS_COLLECTION).doc(uid);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Usuario no encontrado");
      }

      // Desactivar en Firestore
      await docRef.update({
        activo: false,
      });

      // Deshabilitar en Firebase Auth
      await auth.updateUser(uid, {
        disabled: true,
      });

      return {
        success: true,
        message: "Usuario desactivado correctamente",
        uid,
      };
    } catch (error) {
      console.error("❌ Error en eliminarUsuario:", error);
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  /**
   * Generar token personalizado para un usuario
   * @param {string} uid - UID del usuario
   * @returns {Promise<string>} - Token JWT
   */
  async generarTokenPersonalizado(uid) {
    try {
      const usuario = await this.obtenerUsuarioPorUid(uid);

      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      if (!usuario.activo) {
        throw new Error("Usuario inactivo");
      }

      // Generar token con claims personalizados
      const token = await auth.createCustomToken(uid, {
        rol: usuario.rol,
        municipio: usuario.municipio,
      });

      // Actualizar último acceso
      await this.actualizarUltimoAcceso(uid);

      return token;
    } catch (error) {
      console.error("❌ Error en generarTokenPersonalizado:", error);
      throw new Error(`Error al generar token: ${error.message}`);
    }
  }
}

export default new AuthService();
