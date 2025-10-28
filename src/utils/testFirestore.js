// src/utils/testFirestore.js
import { db } from "../config/firebase.js";

/**
 * Script de prueba para verificar conexión con Firestore
 */
async function probarConexionFirestore() {
  console.log("🧪 Iniciando prueba de conexión con Firestore...\n");

  try {
    // Prueba 1: Escribir un documento de prueba
    console.log("📝 Prueba 1: Escribir documento de prueba...");
    const docRef = await db.collection("_test").add({
      mensaje: "Prueba de conexión exitosa",
      timestamp: new Date().toISOString(),
    });
    console.log("✅ Documento creado con ID:", docRef.id);

    // Prueba 2: Leer el documento creado
    console.log("\n📖 Prueba 2: Leer documento...");
    const doc = await db.collection("_test").doc(docRef.id).get();
    if (doc.exists) {
      console.log("✅ Documento leído correctamente:");
      console.log("   Datos:", doc.data());
    }

    // Prueba 3: Listar todos los documentos de prueba
    console.log("\n📋 Prueba 3: Listar documentos...");
    const snapshot = await db.collection("_test").get();
    console.log(`✅ Se encontraron ${snapshot.size} documento(s)`);

    // Prueba 4: Eliminar el documento de prueba
    console.log("\n🗑️  Prueba 4: Eliminar documento...");
    await db.collection("_test").doc(docRef.id).delete();
    console.log("✅ Documento eliminado correctamente");

    console.log("\n🎉 ¡Todas las pruebas pasaron exitosamente!");
    console.log("✅ Firestore está conectado y funcionando correctamente\n");
  } catch (error) {
    console.error("\n❌ Error en las pruebas:");
    console.error("   ", error.message);
    console.error("\n💡 Posibles causas:");
    console.error("   1. Firestore no está habilitado en Firebase Console");
    console.error("   2. Las credenciales no son correctas");
    console.error("   3. Las reglas de seguridad están bloqueando el acceso");
  }
}

// Ejecutar la prueba
probarConexionFirestore();
