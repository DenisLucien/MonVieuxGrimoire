import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type AuthReq = Request & {
  auth?: { userId: string };
};

type jwtPayloadExt = jwt.JwtPayload & {
  userId: string;
};

const auth= (req: AuthReq, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    } else {
      const token2 = token.split(" ")[1];
      const decodedToken = jwt.verify(
        token2,
        "RANDOM_TOKEN_SECRET"
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