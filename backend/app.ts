import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "./models/User";
import Book from "./models/Book";
const app: Application = express();
import bodyParser from "body-parser";
import userRoutes from "./routes/user";
import bookRoutes from "./routes/book";
import cors from "cors";
import path from 'path';

app.use(cors());

mongoose
  .connect(
    "mongodb+srv://westlucien:QABLnmy1Bc2VMdfi@cluster0.bgmxl.mongodb.net/"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log("Connexion à MongoDB échouée :", error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  console.log("Corps de la requête :", req.body);

  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

export default app;
