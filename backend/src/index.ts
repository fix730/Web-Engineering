import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter";
import protectedRouter from "./routes/protectedRouter";
import db from './config/db'; 
import prisma from './config/prisma';
import post from './routes/post';
import user from './routes/user';
import image from './routes/image'

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Routen
app.use("/api/auth", authRouter);
app.use("/api/post",post);
app.use("/api/user", user);
app.use("/api/image", image);
app.use("/api", protectedRouter);



app.get("/", async (req, res) => {
    try {
        // Nutze den Prisma Client, um auf deine 'user'-Tabelle zuzugreifen
        const user = await prisma.user.findFirst(); // Findet den ersten Benutzer
        res.status(200).json({ backend: 'Herzlich Willkommen im Backend', message: 'Datenbankverbindung erfolgreich (Prisma)!', user: user });
    } catch (error) {
        console.error('Fehler beim Abrufen von Daten mit Prisma:', error);
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        res.status(500).json({ message: 'Fehler beim Abrufen von Daten', error: errorMessage });
    }
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//Schließe die Prisma-Verbindung, wenn der Server herunterfährt
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});