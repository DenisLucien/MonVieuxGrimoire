import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("signing up");
  bcrypt
    .hash(req.body.password, 10)
    .then((hash: string) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error: Error) => { res.status(400).json(error);
        });
    })
    .catch((error: Error) => res.status(500).json({ error }));
};

export const login = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("finding user");
  User.findOne({ email: req.body.email })
    .then((user) => {
      console.log("userfound");
      if (user === null) {
        return res
          .status(401)
          .json({ message: "paire identifiant/mot de passe incorrecte" });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid: boolean) => {
            if (!valid) {
              return res
                .status(401)
                .json({ message: "paire identifiant/mot de passe incorrecte" });
            }
            return res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "24h",
              }),
            });
          })
          .catch((error: Error) => res.status(500).json({ error }));
      }
    })
    .catch((error: Error) => res.status(500).json({ error }));
};
