// src/services/formularioService.js
import { db } from "../config/firebase.js";

const COLLECTION_NAME = "formularios";

class FormularioService {
  async crearFormulario(formularioData) {
    try {
      const nuevoFormulario = {
        ...formularioData,
        activo: formularioData.activo ?? true,
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
      };

      const docRef = await db.collection(COLLECTION_NAME).add(nuevoFormulario);

      return {
        id: docRef.id,
        ...nuevoFormulario,
      };
    } catch (error) {
      console.error("❌ Error en crearFormulario:", error);
      throw new Error(`Error al crear el formulario: ${error.message}`);
    }
  }

  async obtenerFormularios(filtros = {}) {
    try {
      let query = db.collection(COLLECTION_NAME);

      if (filtros.activo !== undefined) {
        query = query.where("activo", "==", filtros.activo);
      }

      if (filtros.creadoPor) {
        query = query.where("creadoPor", "==", filtros.creadoPor);
      }

      if (filtros.municipio) {
        query = query.where("municipio", "==", filtros.municipio);
      }

      // ← IMPORTANTE: Esto debe estar SIEMPRE
      query = query.orderBy("creadoEn", "desc");

      const snapshot = await query.get();

      const formularios = [];
      snapshot.forEach((doc) => {
        formularios.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return formularios;
    } catch (error) {
      console.error("❌ Error en obtenerFormularios:", error);
      throw new Error(`Error al obtener formularios: ${error.message}`);
    }
  }

  async obtenerFormularioPorId(id) {
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
      console.error("❌ Error en obtenerFormularioPorId:", error);
      throw new Error(`Error al obtener el formulario: ${error.message}`);
    }
  }

  async actualizarFormulario(id, datosActualizados) {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Formulario no encontrado");
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
      console.error("❌ Error en actualizarFormulario:", error);
      throw new Error(`Error al actualizar el formulario: ${error.message}`);
    }
  }

  async eliminarFormulario(id) {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Formulario no encontrado");
      }

      await docRef.update({
        activo: false,
        actualizadoEn: new Date().toISOString(),
      });

      return {
        success: true,
        message: "Formulario eliminado correctamente",
        id,
      };
    } catch (error) {
      console.error("❌ Error en eliminarFormulario:", error);
      throw new Error(`Error al eliminar el formulario: ${error.message}`);
    }
  }

  async eliminarFormularioPermanente(id) {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id);

      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Formulario no encontrado");
      }

      await docRef.delete();

      return {
        success: true,
        message: "Formulario eliminado permanentemente",
        id,
      };
    } catch (error) {
      console.error("❌ Error en eliminarFormularioPermanente:", error);
      throw new Error(`Error al eliminar permanentemente: ${error.message}`);
    }
  }
}

export default new FormularioService();
