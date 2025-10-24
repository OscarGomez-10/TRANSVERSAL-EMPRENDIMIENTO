import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import quoteController from "./controllers/Quote.js";
import veterinariaRoutes from "./routes/veterinariaRoutes.js";


const app = express();
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO;

app.use(express.json());
app.use(cors());



app.use("/api/veterinaria", veterinariaRoutes);

mongoose.connect(MONGO_URI).then(() => {
  console.log("Conectado a la base de datos");
  
  import("./services/reminder.js").then(() => {
    console.log("🕓 Tareas programadas activadas.");
  });

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}) 

  .catch((error) => {
    console.error("Error al conectar con MongoDB", error);
  });