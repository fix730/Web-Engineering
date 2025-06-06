import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter";
import protectedRouter from "./routes/protectedRouter";


dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api", protectedRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
