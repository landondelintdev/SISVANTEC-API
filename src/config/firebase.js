// src/config/firebase.js
import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";

// Cargar variables de entorno
dotenv.config();

// =========================================
// SOPORTE PARA __dirname EN ESModule
// =========================================
// En CommonJS teníamos __dirname disponible automáticamente
// En ESModule necesitamos construirlo manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================================
// INICIALIZACIÓN DE FIREBASE ADMIN SDK
// =========================================

/**
 * Función para inicializar Firebase Admin
 * Se ejecuta solo una vez para evitar múltiples inicializaciones
 */
const initializeFirebase = async () => {
  try {
    // Verificar si Firebase ya fue inicializado
    if (admin.apps.length > 0) {
      console.log("✅ Firebase ya estaba inicializado");
      return;
    }

    // Obtener la ruta del archivo de credenciales desde .env
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (!serviceAccountPath) {
      throw new Error(
        "❌ FIREBASE_SERVICE_ACCOUNT_PATH no está definido en .env"
      );
    }

    // Construir la ruta absoluta del archivo de credenciales
    const absolutePath = path.resolve(serviceAccountPath);

    // Leer el archivo de credenciales
    const serviceAccountContent = await readFile(absolutePath, "utf-8");
    const serviceAccount = JSON.parse(serviceAccountContent);

    // Inicializar Firebase Admin SDK
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin SDK inicializado correctamente");
    console.log(`📂 Proyecto: ${serviceAccount.project_id}`);
  } catch (error) {
    console.error("❌ Error al inicializar Firebase:", error.message);
    process.exit(1); // Terminar la aplicación si Firebase no se puede conectar
  }
};

// Inicializar Firebase
await initializeFirebase();

// =========================================
// EXPORTAR INSTANCIAS DE FIREBASE
// =========================================

// Instancia de Firestore (base de datos)
const db = admin.firestore();

// Instancia de Firebase Auth
const auth = admin.auth();

// Exportar todo lo que necesitaremos en otros archivos
export { admin, db, auth };
