import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export type AuthReq = Request & {
  auth?: { userId: string };
};

type jwtPayloadExt = jwt.JwtPayload & {
  userId: string;
};

export const auth = (req: AuthReq, res: Response, next: NextFunction): void => {
  try {
    console.log("TOKEN_SECRET:", process.env.TOKEN_SECRET);
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: "Token manquant" });
      return;
    } else {
      const token2 = token.split(" ")[1];
      if (!process.env.TOKEN_SECRET) {
        throw new Error("La clé secrète TOKEN_SECRET est manquante.");
      }
      const decodedToken = jwt.verify(
        token2,
        process.env.TOKEN_SECRET as string // Utilisation de la variable d'environnement
      ) as jwtPayloadExt;
      //   const userId = decodedToken.userId;
      req.auth = {
        userId: decodedToken.userId,
      };
    }

    next();
  } catch (error) {
    res.status(401).json({ error: error || "Requête non authentifiée !" });
  }
};
export default auth;
