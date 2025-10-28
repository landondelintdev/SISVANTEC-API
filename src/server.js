// src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

// Importar configuración de Firebase
import "./config/firebase.js";

// Importar rutas
import formularioRoutes from "./routes/formularioRoutes.js";
import tramiteRoutes from "./routes/tramiteRoutes.js"; // ← NUEVO
import authRoutes from "./routes/authRoutes.js"; // ← NUEVO

// =========================================
// CONFIGURACIÓN INICIAL
// =========================================
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// =========================================
// MIDDLEWARES GLOBALES
// =========================================
app.use(helmet());

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.ALLOWED_ORIGINS?.split(",") || []
      : "*",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =========================================
// RUTAS DE PRUEBA
// =========================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 API SISVANTEC - Servidor funcionando correctamente",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// =========================================
// RUTAS DE LA API
// =========================================
app.use("/api/auth", authRoutes); // ← NUEVO
app.use("/api/formularios", formularioRoutes);
app.use("/api/tramites", tramiteRoutes);

// =========================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// =========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
    path: req.originalUrl,
    metodo: req.method,
  });
});

// =========================================
// MANEJO GLOBAL DE ERRORES
// =========================================
app.use((err, req, res, next) => {
  console.error("❌ Error capturado:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// =========================================
// INICIAR SERVIDOR
// =========================================
// Actualizar el console.log de rutas disponibles

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🚀 Servidor SISVANTEC API iniciado");
  console.log("=".repeat(50));
  console.log(`📡 Escuchando en: http://localhost:${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`⏰ Hora de inicio: ${new Date().toLocaleString()}`);
  console.log("\n📋 Rutas disponibles:");
  console.log("   --- Autenticación ---");
  console.log(`   POST   http://localhost:${PORT}/api/auth/registro`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET    http://localhost:${PORT}/api/auth/perfil`);
  console.log(`   GET    http://localhost:${PORT}/api/auth/usuarios`);
  console.log(`   PUT    http://localhost:${PORT}/api/auth/usuarios/:uid`);
  console.log(`   DELETE http://localhost:${PORT}/api/auth/usuarios/:uid`);
  console.log("   --- Formularios ---");
  console.log(`   POST   http://localhost:${PORT}/api/formularios`);
  console.log(`   GET    http://localhost:${PORT}/api/formularios`);
  console.log(`   GET    http://localhost:${PORT}/api/formularios/:id`);
  console.log(`   PUT    http://localhost:${PORT}/api/formularios/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/formularios/:id`);
  console.log("   --- Trámites ---");
  console.log(`   POST   http://localhost:${PORT}/api/tramites`);
  console.log(`   GET    http://localhost:${PORT}/api/tramites`);
  console.log(`   GET    http://localhost:${PORT}/api/tramites/estadisticas`);
  console.log(`   GET    http://localhost:${PORT}/api/tramites/:id`);
  console.log(`   PUT    http://localhost:${PORT}/api/tramites/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/tramites/:id`);
  console.log("=".repeat(50));
});

export default app;
