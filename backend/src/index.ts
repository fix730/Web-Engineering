import cors from "cors";             
import authRouter from "./routes/authRouter";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// CORS Middleware konfigurieren
app.use(cors({
  origin: "http://localhost:3000",  
  credentials: true,                 
}));

app.use(express.json());
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
