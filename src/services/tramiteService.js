// src/services/tramiteService.js
import { db } from "../config/firebase.js";

const COLLECTION_NAME = "tramites";
const FORMULARIOS_COLLECTION = "formularios";

/**
 * Servicio para gestionar operaciones CRUD de trámites en Firestore
 */
class TramiteService {
  /**
   * Crear un nuevo trámite (respuesta a un formulario)
   * @param {Object} tramiteData - Datos del trámite
   * @returns {Promise<Object>} - Trámite creado con su ID
   */
  async crearTramite(tramiteData) {
    try {
      // Verificar que el formulario existe
      const formularioRef = await db
        .collection(FORMULARIOS_COLLECTION)
        .doc(tramiteData.formularioId)
        .get();

      if (!formularioRef.exists) {
        throw new Error("El formulario especificado no existe");
      }

      const formulario = formularioRef.data();

      // Verificar que el formulario está activo
      if (!formulario.activo) {
        throw new Error("El formulario no está disponible");
      }

      // Crear el trámite
      const nuevoTramite = {
        ...tramiteData,
        formularioTitulo: formulario.titulo,
        municipio: formulario.municipio, // Heredar municipio del formulario
        estado: tramiteData.estado || "pendiente",
        comentarios: tramiteData.comentarios || "",
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
      };

      // Insertar en Firestore
      const docRef = await db.collection(COLLECTION_NAME).add(nuevoTramite);

      return {
        id: docRef.id,
        ...nuevoTramite,
      };
    } catch (error) {
      console.error("❌ Error en crearTramite:", error);
      throw new Error(`Error al crear el trámite: ${error.message}`);
    }
  }

  /**
   * Obtener todos los trámites con filtros opcionales
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise<Array>} - Lista de trámites
   */
  async obtenerTramites(filtros = {}) {
    try {
      let query = db.collection(COLLECTION_NAME);

      // Filtros
      if (filtros.municipio) {
        query = query.where("municipio", "==", filtros.municipio);
      }

      if (filtros.usuarioId) {
        query = query.where("usuarioId", "==", filtros.usuarioId);
      }

      if (filtros.formularioId) {
        query = query.where("formularioId", "==", filtros.formularioId);
      }

      if (filtros.estado) {
        query = query.where("estado", "==", filtros.estado);
      }

      // Ordenar por fecha de creación
      query = query.orderBy("creadoEn", "desc");

      const snapshot = await query.get();

      const tramites = [];
      snapshot.forEach((doc) => {
        tramites.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return tramites;
    } catch (error) {
      console.error("❌ Error en obtenerTramites:", error);
      throw new Error(`Error al obtener trámites: ${error.message}`);
    }
  }

  /**
   * Obtener un trámite por ID
   * @param {string} id - ID del trámite
   * @returns {Promise<Object|null>} - Trámite encontrado o null
   */
  async obtenerTramitePorId(id) {
    try {
      const doc = await db.collection(COLLECTION_NAME).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      console.error("❌ Error en obtenerTramitePorId:", error);
      throw new Error(`Error al obtener el trámite: ${error.message}`);
    }
  }

  /**
   * Actualizar el estado de un trámite
   * @param {string} id - ID del trámite
   * @param {Object} datosActualizados - Datos a actualizar
   * @returns {Promise<Object>} - Trámite actualizado
   */
  async actualizarTramite(id, datosActualizados) {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Trámite no encontrado");
      }

      const actualizacion = {
        ...datosActualizados,
        actualizadoEn: new Date().toISOString(),
      };

      await docRef.update(actualizacion);

      const docActualizado = await docRef.get();

      return {
        id: docActualizado.id,
        ...docActualizado.data(),
      };
    } catch (error) {
      console.error("❌ Error en actualizarTramite:", error);
      throw new Error(`Error al actualizar el trámite: ${error.message}`);
    }
  }

  /**
   * Eliminar un trámite permanentemente
   * @param {string} id - ID del trámite
   * @returns {Promise<Object>} - Confirmación de eliminación
   */
  async eliminarTramite(id) {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Trámite no encontrado");
      }

      await docRef.delete();

      return {
        success: true,
        message: "Trámite eliminado permanentemente",
        id,
      };
    } catch (error) {
      console.error("❌ Error en eliminarTramite:", error);
      throw new Error(`Error al eliminar el trámite: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de trámites por municipio
   * @param {string} municipio - Municipio a consultar
   * @returns {Promise<Object>} - Estadísticas
   */
  async obtenerEstadisticas(municipio = null) {
    try {
      let query = db.collection(COLLECTION_NAME);

      if (municipio) {
        query = query.where("municipio", "==", municipio);
      }

      const snapshot = await query.get();

      const estadisticas = {
        total: snapshot.size,
        pendientes: 0,
        enRevision: 0,
        aprobados: 0,
        rechazados: 0,
      };

      snapshot.forEach((doc) => {
        const tramite = doc.data();
        switch (tramite.estado) {
          case "pendiente":
            estadisticas.pendientes++;
            break;
          case "en_revision":
            estadisticas.enRevision++;
            break;
          case "aprobado":
            estadisticas.aprobados++;
            break;
          case "rechazado":
            estadisticas.rechazados++;
            break;
        }
      });

      return estadisticas;
    } catch (error) {
      console.error("❌ Error en obtenerEstadisticas:", error);
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

export default new TramiteService();
